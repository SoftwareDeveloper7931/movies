import fs from 'fs';

const f1 = JSON.parse(fs.readFileSync('scripts/top-rated-indian-movies-01.json'));
const f2 = JSON.parse(fs.readFileSync('scripts/top-rated-indian-movies-02.json'));
const all = [...f1, ...f2];

// Known South Indian actors / directors / titles
const southKeywords = [
  'Mohanlal', 'Kamal Haasan', 'Rajinikanth', 'Mammootty', 'Suriya', 'Vikram', 'Dhanush',
  'Prabhas', 'Allu Arjun', 'Mahesh Babu', 'N.T. Rama Rao Jr.', 'Ram Charan', 'Yash',
  'Rishab Shetty', 'Fahadh Faasil', 'Dulquer Salmaan', 'Nivin Pauly', 'Prithviraj',
  'Vijay Sethupathi', 'Sivakarthikeyan', 'Karthi', 'Nani', 'Vijay', 'Ajith Kumar',
  'S.S. Rajamouli', 'Mani Ratnam', 'Lokesh Kanagaraj', 'Prashanth Neel', 'Pa. Ranjith',
  'Vetrimaaran', 'Gautham Vasudev Menon', 'Shankar', 'Trivikram Srinivas', 'Sukumar',
  'Drishyam', 'Nayakan', 'Anbe Sivam', 'Thani Oruvan', '24', 'Magadheera', 'Vikram Vedha',
  'Baahubali', 'Kaithi', 'Super Deluxe', 'Ratsasan', 'Pariyerum Perumal', 'Aruvi',
  'Premam', 'Bangalore Days', 'Kumbalangi Nights', 'Lucifer', 'Maheshinte Prathikaaram',
  'Ugramm', 'Kirik Party', 'Manichitrathazhu', 'Thalapathi', 'Iruvar', 'Kannathil Muthamittal',
  'Roja', 'Bombay', 'Kaakha Kaakha', 'Sivaji', 'Enthiran', 'Aparichit', 'Anniyan',
  'Jersey', 'Mahanati', 'Rangasthalam', 'Arjun Reddy', 'Eega', 'Okkadu', 'Athadu', 'Pokiri',
  'Khaleja', 'Dookudu', 'Manam', 'Srimanthudu', 'Kshanam', 'Goodachari', 'Agent Sai Srinivasa',
  'Ulidavaru Kandanthe', 'Lucia', 'Thithi', 'Dia', 'Love Mocktail', 'Garuda Gamana'
];

let southCount = 0;
let bollyCount = 0;

all.forEach(m => {
  const text = `${m.title} ${(m.actors || []).join(' ')} ${m.storyline || ''}`;
  const isSouth = southKeywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
  if (isSouth) southCount++;
  else bollyCount++;
});

console.log('Classified Indian movies: South Indian =', southCount, ', Bollywood =', bollyCount);
