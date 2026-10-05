import { execSync } from 'child_process';

const testTitles = [
  'RRR_(film)',
  'Baahubali:_The_Beginning',
  'Baahubali_2:_The_Conclusion',
  'K.G.F:_Chapter_1',
  'K.G.F:_Chapter_2',
  'Pushpa:_The_Rise',
  'Kantara_(film)',
  'Vikram_(2022_film)',
  'Jailer_(2023_film)',
  'Leo_(2023_Indian_film)',
  'Jawan_(film)',
  'Pathaan_(film)',
  'Animal_(2023_film)',
  'Stree_2',
  'Dangal_(film)'
];

console.log('Testing Wikipedia batch query:');
for (const t of testTitles) {
  try {
    const raw = execSync(`curl.exe -s -A "Mozilla/5.0" "https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}"`, { timeout: 8000 }).toString();
    const data = JSON.parse(raw);
    console.log(`- ${data.title}: ${data.thumbnail ? data.thumbnail.source : 'NO THUMB'}`);
  } catch (e) {
    console.log(`- ${t} failed:`, e.message);
  }
}
