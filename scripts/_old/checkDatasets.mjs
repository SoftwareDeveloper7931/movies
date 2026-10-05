import { execSync } from 'child_process';

const testUrls = [
  'https://raw.githubusercontent.com/calci/bollywood-movie-dataset/master/BollywoodMovieDetail.csv',
  'https://raw.githubusercontent.com/pncnmnp/TIMDB/master/data/bollywood.csv',
  'https://raw.githubusercontent.com/pncnmnp/TIMDB/master/bollywood.csv',
  'https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies-2020s.json'
];

for (const u of testUrls) {
  try {
    const res = execSync(`curl.exe -I -s -L "${u}"`, { timeout: 10000 }).toString();
    console.log(u, '-->', res.split('\r\n')[0] || res.split('\n')[0]);
  } catch (e) {
    console.log(u, '--> ERROR');
  }
}
