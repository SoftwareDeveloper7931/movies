import fs from 'fs';

const f1 = JSON.parse(fs.readFileSync('scripts/top-rated-indian-movies-01.json'));
const f2 = JSON.parse(fs.readFileSync('scripts/top-rated-indian-movies-02.json'));
const all = [...f1, ...f2];

console.log('Sample storylines and originalTitles to detect language:');
for (let i = 0; i < 20; i++) {
  const m = all[i];
  console.log(`- ${m.title} (${m.year}) | actors: ${(m.actors || []).slice(0, 2).join(', ')}`);
}
