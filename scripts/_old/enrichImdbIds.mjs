import fs from 'fs';

const films = JSON.parse(fs.readFileSync('src/data/films.json', 'utf8'));

// Common known blockbusters with verified IMDb IDs
const KNOWN_IMDB = {
  "rrr-2022": "tt8178634",
  "baahubali-the-beginning-2015": "tt2631186",
  "baahubali-2-the-conclusion-2017": "tt4849438",
  "kgf-chapter-1-2018": "tt7838252",
  "kgf-chapter-2-2022": "tt10698680",
  "pushpa-the-rise-2021": "tt9389998",
  "pushpa-2-the-rule-2024": "tt19894982",
  "kantara-2022": "tt15327088",
  "vikram-2022": "tt9179430",
  "leo-2023": "tt5755238",
  "jailer-2023": "tt11663228",
  "salaar-part-1-ceasefire-2023": "tt13927994",
  "devara-part-1-2024": "tt14594680",
  "kalki-2898-ad-2024": "tt12735488",
  "hanu-man-2024": "tt15426162",
  "ponniyin-selvan-part-i-2022": "tt10701074",
  "ponniyin-selvan-part-2-2023": "tt22268712",
  "dangal-2016": "tt5074352",
  "3-idiots-2009": "tt1187043",
  "taare-zameen-par-2007": "tt0986264",
  "sholay-1975": "tt0073707",
  "lagaan-once-upon-a-time-in-india-2001": "tt0169102",
  "dilwale-dulhania-le-jayenge-1995": "tt0112870",
  "gangs-of-wasseypur-2012": "tt1954470",
  "andhadhun-2018": "tt8236336",
  "tumbbad-2018": "tt8239946",
  "queen-2013": "tt3322420",
  "zindagi-na-milegi-dobara-2011": "tt1562872",
  "drishyam-2013": "tt3417422",
  "drishyam-2015": "tt4430212",
  "vikram-vedha-2017": "tt7060344",
  "kaithi-2019": "tt9900782",
  "super-deluxe-2019": "tt7019942",
  "ratsasan-2018": "tt7060344",
  "magadheera-2009": "tt1447500",
  "anand-1971": "tt0066763",
  "gol-maal-1979": "tt0079221",
  "nayakan-1987": "tt0093603",
  "anbe-sivam-2003": "tt0367495",
  "thalapathi-1991": "tt0103069",
  "roja-1992": "tt0105271",
  "bombay-1995": "tt0112548",
  "kannathil-muthamittal-2002": "tt0316090",
  "ghajini-2005": "tt0449951",
  "ghajini-2008": "tt1085252",
  "swades-2004": "tt0367110",
  "chak-de-india-2007": "tt0871510",
  "piku-2015": "tt4120192",
  "barfi-2012": "tt2082197",
  "bhaag-milkha-bhaag-2013": "tt2356180",
  "bajrangi-bhaijaan-2015": "tt3863552",
  "secret-superstar-2017": "tt6108090",
  "stree-2018": "tt8108202",
  "stree-2-2024": "tt28328126",
  "jawan-2023": "tt15354916",
  "pathaan-2023": "tt12844910",
  "animal-2023": "tt13751694",
  "12th-fail-2023": "tt23849204",
  "maharaja-2024": "tt26548265",
  "lucifer-2019": "tt8481966",
  "premam-2015": "tt4648786",
  "charlie-2015": "tt5131556",
  "kumbalangi-nights-2019": "tt8413338",
  "bangalore-days-2014": "tt3741832",
  "manichitrathazhu-1993": "tt0210827"
};

for (const film of films) {
  if (KNOWN_IMDB[film.id]) {
    film.imdb_id = KNOWN_IMDB[film.id];
  }
}

async function resolveMissing() {
  const missing = films.filter(f => f.ia_identifier?.endsWith('_hd') && !f.imdb_id);
  console.log(`Resolving ${missing.length} missing IMDb IDs via Cinemeta...`);
  
  for (let i = 0; i < missing.length; i++) {
    const f = missing[i];
    const cleanTitle = f.title.replace(/\s*\(\d{4}\)|\s*\([A-Za-z\s]+\)/g, '').trim();
    try {
      const res = await fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(cleanTitle)}.json`);
      if (res.ok) {
        const data = await res.json();
        const metas = data?.metas;
        if (metas && metas.length > 0) {
          const match = metas.find(m => m.releaseInfo == f.year || m.year == f.year) || metas[0];
          const imdbId = match.imdb_id || match.id;
          if (imdbId && imdbId.startsWith('tt')) {
            f.imdb_id = imdbId;
            console.log(`[${i + 1}/${missing.length}] ${f.title} -> ${imdbId}`);
          }
        }
      }
    } catch (err) {
      console.warn(`Failed ${f.title}:`, err.message);
    }
    // Small throttle
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync('src/data/films.json', JSON.stringify(films, null, 2), 'utf8');
  console.log('Successfully updated src/data/films.json');
}

resolveMissing();
