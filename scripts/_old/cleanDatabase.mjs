import fs from 'fs';

const films = JSON.parse(fs.readFileSync('./src/data/films.json', 'utf8'));

console.log(`Original films count: ${films.length}`);

// Blocklist inappropriate / non-movies
const blocklist = [
  'the-child-molester',
  'recurring-dinosaur-infestation',
];

const cleanedFilms = [];
const seenIds = new Set();

for (const film of films) {
  // Check blocklist
  if (blocklist.some(b => film.id.toLowerCase().includes(b))) {
    continue;
  }

  // Clean title
  let cleanTitle = film.title
    .replace(/^CUKESIM's New Job! \( Charles Chaplin-1915\)$/i, 'His New Job')
    .replace(/^Das Kabinett des Doktor Caligari \( The Cabinet of Dr\. Caligari \)$/i, 'The Cabinet of Dr. Caligari')
    .replace(/\.avi$/i, '')
    .replace(/\.mp4$/i, '')
    .replace(/JohnIreland1954goofyrip/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  film.title = cleanTitle;

  // Specific fix for Night of the Living Dead
  if (film.id === 'night-of-the-living-dead-1968' || film.title.toLowerCase() === 'night of the living dead') {
    film.id = 'night-of-the-living-dead-1968';
    film.title = 'Night of the Living Dead';
    film.year = 1968;
    film.director = 'George A. Romero';
    film.genres = ['Horror', 'Mystery', 'Cult'];
    film.ia_identifier = 'Night.Of.The.Living.Dead_1080p';
    film.thumbnail = 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg';
    film.backdrop = 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg';
    film.runtime = '96 min';
    film.featured = true;
    film.rights_checked = true;
    film.license_name = 'Public Domain Mark 1.0';
    film.license_url = 'https://creativecommons.org/publicdomain/mark/1.0/';
    film.description = "A ragtag group of Pennsylvanians barricade themselves in an old farmhouse to remain safe from a bloodthirsty, flesh-eating breed of reanimated corpses. George A. Romero's revolutionary masterpiece entered the public domain immediately upon release due to an omission of the copyright notice by the original theatrical distributor.";
  }

  // Avoid duplicates
  if (seenIds.has(film.id)) {
    continue;
  }
  seenIds.add(film.id);

  cleanedFilms.push(film);
}

// Ensure Night of the Living Dead is first if featured
cleanedFilms.sort((a, b) => {
  if (a.id === 'night-of-the-living-dead-1968') return -1;
  if (b.id === 'night-of-the-living-dead-1968') return 1;
  return (b.downloads || 0) - (a.downloads || 0);
});

console.log(`Cleaned films count: ${cleanedFilms.length}`);
fs.writeFileSync('./src/data/films.json', JSON.stringify(cleanedFilms, null, 2));
console.log('Successfully saved to src/data/films.json');
