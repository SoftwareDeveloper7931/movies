import { execSync } from 'child_process';
import fs from 'fs';

const cardRegex = /<a[^>]+href=([^\s>]+)[^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=([^\s>]+)[\s\S]*?<h2[^>]*class=[^>]*card-title[^>]*>([\s\S]*?)<\/h2>/gi;

const scraped = [];
for (let p = 1; p <= 10; p++) {
  try {
    const url = `https://moviespedia.net/movies/page/${p}/`;
    const html = execSync(`curl.exe -s "${url}"`, { timeout: 15000 }).toString();
    let m;
    while ((m = cardRegex.exec(html)) !== null) {
      scraped.push({
        href: m[1].replace(/['"]/g, ''),
        img: m[2].replace(/['"]/g, ''),
        title: m[3].replace(/<[^>]+>/g, '').trim()
      });
    }
    console.log(`Page ${p} fetched, cumulative count: ${scraped.length}`);
  } catch (e) {
    console.log(`Page ${p} error:`, e.message);
  }
}

fs.writeFileSync('scripts/moviespedia_sample.json', JSON.stringify(scraped, null, 2));
console.log('Done. Total:', scraped.length);
