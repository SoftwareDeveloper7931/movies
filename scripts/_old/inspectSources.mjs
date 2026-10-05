import { execSync } from 'child_process';

const samplePages = [1, 5, 10, 20, 30, 40, 50];
const cardRegex = /<a[^>]+href=([^\s>]+)[^>]*>[\s\S]*?<img[^>]+(?:data-src|src)=([^\s>]+)[\s\S]*?<h2[^>]*class=[^>]*card-title[^>]*>([\s\S]*?)<\/h2>/gi;

for (const p of samplePages) {
  try {
    const html = execSync(`curl.exe -s "https://moviespedia.net/movies/page/${p}/"`, { timeout: 15000 }).toString();
    const titles = [];
    let m;
    while ((m = cardRegex.exec(html)) !== null) {
      titles.push({
        title: m[3].replace(/<[^>]+>/g, '').trim(),
        img: m[2]
      });
    }
    console.log(`Page ${p} count: ${titles.length}, sample:`, titles.slice(0, 3));
  } catch (e) {
    console.log(`Page ${p} failed:`, e.message);
  }
}
