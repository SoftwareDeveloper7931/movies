import { execSync } from 'child_process';
import fs from 'fs';

const head = execSync('curl.exe -s -L "https://raw.githubusercontent.com/calci/bollywood-movie-dataset/master/BollywoodMovieDetail.csv"', { maxBuffer: 10 * 1024 * 1024 }).toString();
const lines = head.split('\n');
console.log('Total lines:', lines.length);
console.log('Header:', lines[0]);
console.log('Line 1:', lines[1]);
console.log('Line 2:', lines[2]);
