import fs from 'fs';

const html = fs.readFileSync('scripts/moviespedia_page1.html', 'utf8');
const links = html.match(/href=[\"'][^\"']+[\"']/g) || [];
const uniqueLinks = [...new Set(links.map(l => l.replace(/href=[\"']|[\"']/g, '')))];

console.log('All unique links:', uniqueLinks.slice(0, 30));

