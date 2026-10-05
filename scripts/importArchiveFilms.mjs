import fs from 'fs';

const USER_AGENT = 'LegalArchiveCinemaBot/1.0 (https://github.com/SoftwareDeveloper7931/movies; contact@domain.org)';

/**
 * Classifies license URL into PD, CC0, CC BY, or CC BY-SA.
 * Returns null if missing, non-commercial (NC), or unverified.
 */
export function classifyLicense(licenseurl) {
  if (!licenseurl || typeof licenseurl !== 'string') return null;
  const url = licenseurl.toLowerCase().trim();

  // Strict: Exclude all non-commercial (NC) licenses
  if (url.includes('-nc') || url.includes('/nc')) {
    return null;
  }

  // CC0 (Public Domain Dedication)
  if (url.includes('publicdomain/zero') || url.includes('/zero/') || url.includes('cc0')) {
    return {
      type: 'CC0',
      name: 'Creative Commons Zero (CC0 1.0)',
      url: licenseurl,
    };
  }

  // Public Domain Mark 1.0 or legacy PD
  if (url.includes('publicdomain') || url.includes('/mark/')) {
    return {
      type: 'PD',
      name: 'Public Domain Mark 1.0',
      url: licenseurl,
    };
  }

  // CC BY-SA (Attribution-ShareAlike)
  if (url.includes('/by-sa/')) {
    return {
      type: 'CC BY-SA',
      name: 'Creative Commons Attribution-ShareAlike',
      url: licenseurl,
    };
  }

  // CC BY (Attribution)
  if (url.includes('/by/')) {
    return {
      type: 'CC BY',
      name: 'Creative Commons Attribution',
      url: licenseurl,
    };
  }

  return null;
}

/**
 * Normalizes runtime string into readable format (e.g. "92 min")
 */
function normalizeRuntime(runtime, files) {
  if (runtime) {
    const parts = runtime.toString().split(':');
    if (parts.length === 3) {
      const mins = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      return `${mins} min`;
    }
    if (parts.length === 2) {
      return `${parseInt(parts[0], 10)} min`;
    }
    if (!isNaN(Number(runtime))) {
      return `${Math.round(Number(runtime))} min`;
    }
  }

  if (Array.isArray(files)) {
    const vid = files.find(f => f.length && (f.name?.endsWith('.mp4') || f.name?.endsWith('.ogv')));
    if (vid && vid.length) {
      const mins = Math.round(parseFloat(vid.length) / 60);
      if (mins > 0) return `${mins} min`;
    }
  }

  return 'Feature';
}

/**
 * Maps subject tags to standardized cinema genres
 */
function extractGenres(subject) {
  const standardGenres = [
    'Film Noir',
    'Horror',
    'Sci-Fi',
    'Comedy',
    'Drama',
    'Mystery',
    'Silent',
    'Western',
    'Thriller',
    'Adventure',
    'Crime',
    'Action',
    'Fantasy',
    'Romance',
    'Animation',
    'War',
    'Documentary',
  ];

  const matched = new Set();
  const rawTags = Array.isArray(subject) ? subject : typeof subject === 'string' ? subject.split(/[,;]/) : [];

  for (const tag of rawTags) {
    const cleanTag = tag.trim().toLowerCase();
    for (const genre of standardGenres) {
      if (cleanTag.includes(genre.toLowerCase())) {
        matched.add(genre);
      }
    }
  }

  if (matched.size === 0) {
    for (const tag of rawTags) {
      const t = tag.trim();
      if (t.length > 2 && t.length < 25 && !t.includes('http') && !t.includes('Archive') && !t.includes(':')) {
        matched.add(t.charAt(0).toUpperCase() + t.slice(1));
        if (matched.size >= 2) break;
      }
    }
  }

  return matched.size > 0 ? Array.from(matched) : ['Classic'];
}

function cleanDescription(desc) {
  if (!desc) return 'Archival motion picture preserved in the Internet Archive collection under a verified open license.';
  if (Array.isArray(desc)) desc = desc.join(' ');
  return desc
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isJunkTitle(title) {
  if (!title) return true;
  const t = title.toLowerCase();
  const junkPatterns = [
    'capcut',
    'template',
    'test video',
    'download 20',
    'ssscap',
    'batch, disc',
    'batch, part',
    'home video',
    'raw footage',
    'sample video',
    'test stream',
  ];
  return junkPatterns.some(p => t.includes(p));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const args = process.argv.slice(2);
  const targetCount = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '60', 10);
  const rowsPerPage = 50;

  console.log(`Starting Internet Archive Verified Catalog Import...`);
  console.log(`Target verified films: ${targetCount}`);

  // Query: mediatype:movies AND (licenseurl:*publicdomain* OR licenseurl:*by* OR licenseurl:*zero*) NOT licenseurl:*nc*
  // Prioritizing feature_films and quality movies sorted by downloads
  const queries = [
    'collection:feature_films AND mediatype:movies AND (licenseurl:*publicdomain* OR licenseurl:*by* OR licenseurl:*zero*) NOT licenseurl:*nc*',
    'mediatype:movies AND (licenseurl:*publicdomain* OR licenseurl:*by* OR licenseurl:*zero*) NOT licenseurl:*nc*',
  ];

  const reportRecords = [];
  const verifiedFilms = [];
  const seenIdentifiers = new Set();

  queryLoop: for (const searchQuery of queries) {
    let page = 1;
    while (verifiedFilms.length < targetCount && page <= 5) {
      const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&fl[]=identifier&fl[]=title&fl[]=description&fl[]=year&fl[]=creator&fl[]=licenseurl&fl[]=subject&fl[]=runtime&fl[]=downloads&sort[]=downloads+desc&rows=${rowsPerPage}&page=${page}&output=json`;

      console.log(`\nFetching search page ${page} for query (${verifiedFilms.length}/${targetCount} verified)...`);
      let searchData;
      try {
        const res = await fetch(searchUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (!res.ok) {
          console.error(`Search failed status ${res.status}`);
          break;
        }
        searchData = await res.json();
      } catch (err) {
        console.error(`Fetch search error:`, err.message);
        break;
      }

      const docs = searchData?.response?.docs || [];
      if (docs.length === 0) break;

      for (const item of docs) {
        if (verifiedFilms.length >= targetCount) break queryLoop;

        const identifier = item.identifier;
        if (!identifier || seenIdentifiers.has(identifier)) continue;
        seenIdentifiers.add(identifier);

        // Filter junk / templates
        if (isJunkTitle(item.title)) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: 'FILTERED',
            license_url: item.licenseurl || '',
            reason: 'Excluded non-film title (template/raw footage/batch fragment)',
          });
          continue;
        }

        // Check search license
        const searchLicense = classifyLicense(item.licenseurl);
        if (!item.licenseurl) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: 'NONE',
            license_url: '',
            reason: 'Missing licenseurl in item metadata',
          });
          continue;
        }

        if (!searchLicense) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: 'INVALID',
            license_url: item.licenseurl,
            reason: 'License is Non-Commercial (NC) or not recognized open license',
          });
          continue;
        }

        // Fetch official metadata (wait 1.2s to be polite)
        await sleep(1200);

        let metadata;
        try {
          const metaRes = await fetch(`https://archive.org/metadata/${identifier}`, {
            headers: { 'User-Agent': USER_AGENT },
          });
          if (!metaRes.ok) {
            reportRecords.push({
              identifier,
              title: item.title || identifier,
              status: 'SKIPPED',
              license_type: searchLicense.type,
              license_url: item.licenseurl,
              reason: `Metadata request failed (HTTP ${metaRes.status})`,
            });
            continue;
          }
          metadata = await metaRes.json();
        } catch (err) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: searchLicense.type,
            license_url: item.licenseurl,
            reason: `Metadata network error: ${err.message}`,
          });
          continue;
        }

        const files = metadata.files || [];
        const metaObj = metadata.metadata || {};

        // Verify licenseurl in detailed metadata
        const detailedLicenseUrl = metaObj.licenseurl || item.licenseurl;
        const verifiedLicense = classifyLicense(detailedLicenseUrl);

        if (!verifiedLicense) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: 'INVALID',
            license_url: detailedLicenseUrl,
            reason: 'Verified detailed licenseurl is NC or invalid',
          });
          continue;
        }

        // Verify playable video file (mp4 or ogv)
        const playableFile = files.find(f => {
          if (!f.name) return false;
          const name = f.name.toLowerCase();
          return (name.endsWith('.mp4') || name.endsWith('.ogv')) && f.format !== 'Animated GIF';
        });

        if (!playableFile) {
          reportRecords.push({
            identifier,
            title: item.title || identifier,
            status: 'SKIPPED',
            license_type: verifiedLicense.type,
            license_url: detailedLicenseUrl,
            reason: 'No playable .mp4 or .ogv video file found in archive files',
          });
          continue;
        }

        const title = metaObj.title || item.title || identifier;
        const year = parseInt(metaObj.year || item.year || (metaObj.date ? metaObj.date.slice(0, 4) : '1940'), 10) || 1940;
        const creator = metaObj.creator || item.creator || metaObj.director || undefined;
        const runtime = normalizeRuntime(metaObj.runtime || item.runtime, files);
        const genres = extractGenres(metaObj.subject || item.subject);
        const description = cleanDescription(metaObj.description || item.description);
        const downloads = parseInt(item.downloads || metaObj.downloads || '0', 10);

        const filmRecord = {
          id: identifier,
          title,
          year,
          description,
          runtime,
          license_url: verifiedLicense.url,
          license_name: verifiedLicense.name,
          license_type: verifiedLicense.type,
          creator: Array.isArray(creator) ? creator.join(', ') : creator,
          director: Array.isArray(creator) ? creator.join(', ') : creator,
          ia_identifier: identifier,
          thumbnail: `https://archive.org/services/img/${identifier}`,
          rights_checked: true,
          genres,
          downloads,
          featured: verifiedFilms.length < 5,
          created_at: metaObj.publicdate || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        verifiedFilms.push(filmRecord);
        reportRecords.push({
          identifier,
          title,
          status: 'KEPT',
          license_type: verifiedLicense.type,
          license_url: verifiedLicense.url,
          reason: `Verified ${verifiedLicense.type} license with playable stream (${playableFile.name})`,
        });

        console.log(`[KEPT ${verifiedFilms.length}/${targetCount}] ${title} (${year}) [${verifiedLicense.type}]`);
      }
      page++;
      await sleep(1500);
    }
  }

  console.log(`\n==============================================`);
  console.log(`Import Complete!`);
  console.log(`Total candidates processed: ${reportRecords.length}`);
  console.log(`Total verified kept: ${verifiedFilms.length}`);
  console.log(`Total skipped: ${reportRecords.filter(r => r.status === 'SKIPPED').length}`);

  // License type distribution
  const dist = {};
  verifiedFilms.forEach(f => {
    dist[f.license_type] = (dist[f.license_type] || 0) + 1;
  });
  console.log(`License Distribution:`, dist);
  console.log(`==============================================\n`);

  // Write import-report.csv
  const csvHeaders = ['identifier', 'title', 'status', 'license_type', 'license_url', 'reason'];
  const csvRows = reportRecords.map(r => {
    return [
      `"${r.identifier.replace(/"/g, '""')}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.license_type}"`,
      `"${(r.license_url || '').replace(/"/g, '""')}"`,
      `"${r.reason.replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
  fs.writeFileSync('import-report.csv', csvContent, 'utf8');
  console.log(`Wrote import report to import-report.csv`);

  // Save verified films to src/data/films.json
  fs.writeFileSync('src/data/films.json', JSON.stringify(verifiedFilms, null, 2), 'utf8');
  console.log(`Saved ${verifiedFilms.length} verified films to src/data/films.json`);
}

main().catch(err => {
  console.error('Fatal error in import script:', err);
  process.exit(1);
});
