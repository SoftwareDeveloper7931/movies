import { execSync } from 'child_process';
import fs from 'fs';

const films = JSON.parse(fs.readFileSync('./src/data/films.json', 'utf8'));

// Curated map of iconic classic films to their Wikipedia summary keys or direct high-res poster URLs
const posterMap = {
  'Night of the Living Dead': 'https://upload.wikimedia.org/wikipedia/en/9/91/Night_of_the_Living_Dead_%281968%29_poster.jpg',
  'His Girl Friday': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/His_Girl_Friday_%281940_poster%29_crop.jpg/640px-His_Girl_Friday_%281940_poster%29_crop.jpg',
  'The Phantom of the Opera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/The_Phantom_of_the_Opera_%281925_film_poster%29.jpg/640px-The_Phantom_of_the_Opera_%281925_film_poster%29.jpg',
  'House on Haunted Hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/House_on_Haunted_Hill_1959.jpg/640px-House_on_Haunted_Hill_1959.jpg',
  'Plan 9 from Outer Space': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plan_9_Alternative_poster.jpg/640px-Plan_9_Alternative_poster.jpg',
  'The Cabinet of Dr. Caligari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Das_Cabinet_des_Dr._Caligari_%281920%29_poster.jpg/640px-Das_Cabinet_des_Dr._Caligari_%281920%29_poster.jpg',
  'Metropolis': 'https://upload.wikimedia.org/wikipedia/en/0/06/Metropolisposter.jpg',
  'Detour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Detour_%281945%29_poster.jpg/640px-Detour_%281945%29_poster.jpg',
  'A Star Is Born': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/A_Star_Is_Born_1937_poster.jpg/640px-A_Star_Is_Born_1937_poster.jpg',
  'Carnival of Souls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Carnival_of_Souls_poster.jpg/640px-Carnival_of_Souls_poster.jpg',
  'Nosferatu': 'https://upload.wikimedia.org/wikipedia/en/9/92/Nosferatuposter.jpg',
  'The Little Shop of Horrors': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Little_Shop_of_Horrors_poster.jpg/640px-Little_Shop_of_Horrors_poster.jpg',
  'The Stranger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/The_Stranger_%281946%29_poster.jpg/640px-The_Stranger_%281946%29_poster.jpg',
  'Charade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Charade_1963_theatrical_poster.jpg/640px-Charade_1963_theatrical_poster.jpg',
  'The Last Man on Earth': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/The_Last_Man_on_Earth_%281964_film_poster%29.jpg/640px-The_Last_Man_on_Earth_%281964_film_poster%29.jpg',
  'Cyrano de Bergerac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Cyrano_de_Bergerac_%281950%29_poster.jpg/640px-Cyrano_de_Bergerac_%281950%29_poster.jpg',
  'Gulliver\'s Travels': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Gulliver%27s_Travels_%281939%29_poster.jpg/640px-Gulliver%27s_Travels_%281939%29_poster.jpg',
  'Jungle Book': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Jungle_Book_1942_poster.jpg/640px-Jungle_Book_1942_poster.jpg',
  'McLintock!': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/McLintock%21_%281963%29_poster.jpg/640px-McLintock%21_%281963%29_poster.jpg',
  'Dressed to Kill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dressed_to_Kill_%281946_film%29_poster.jpg/640px-Dressed_to_Kill_%281946_film%29_poster.jpg',
  'Suddenly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Suddenly_%281954%29_poster.jpg/640px-Suddenly_%281954%29_poster.jpg',
  'Kansas City Confidential': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Kansas_City_Confidential_%281952%29_poster.jpg/640px-Kansas_City_Confidential_%281952%29_poster.jpg',
  'The Strange Love of Martha Ivers': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/The_Strange_Love_of_Martha_Ivers_%281946%29_poster.jpg/640px-The_Strange_Love_of_Martha_Ivers_%281946%29_poster.jpg',
  'Things to Come': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Things_to_Come_%281936%29_poster.jpg/640px-Things_to_Come_%281936%29_poster.jpg',
  'The 39 Steps': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/The_39_Steps_%281935_poster%29.jpg/640px-The_39_Steps_%281935_poster%29.jpg',
  'The Lady Vanishes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/The_Lady_Vanishes_%281938_film_poster%29.jpg/640px-The_Lady_Vanishes_%281938_film_poster%29.jpg',
  'The General': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_General_%281926_film_poster%29.jpg/640px-The_General_%281926_film_poster%29.jpg',
  'Steamboat Bill, Jr.': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Steamboat_Bill_Jr_poster.jpg/640px-Steamboat_Bill_Jr_poster.jpg',
  'The Gold Rush': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/The_Gold_Rush_poster.jpg/640px-The_Gold_Rush_poster.jpg',
  'Battleship Potemkin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Battleship_Potemkin_poster.jpg/640px-Battleship_Potemkin_poster.jpg',
  'Scarlet Street': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Scarlet_Street_%281945%29_poster.jpg/640px-Scarlet_Street_%281945%29_poster.jpg',
  'Impact': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Impact_1949_poster.jpg/640px-Impact_1949_poster.jpg',
  'D.O.A.': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/DOA_%281949%29_poster.jpg/640px-DOA_%281949%29_poster.jpg',
  'The Hitch-Hiker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/The_Hitch-Hiker_poster.jpg/640px-The_Hitch-Hiker_poster.jpg',
  'My Favorite Brunette': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/My_Favorite_Brunette_%281947%29_poster.jpg/640px-My_Favorite_Brunette_%281947%29_poster.jpg',
  'The Fast and the Furious': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Fast_and_the_Furious_%281954_film%29_poster.jpg/640px-The_Fast_and_the_Furious_%281954_film%29_poster.jpg',
  'Reefer Madness': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Reefer_madness_poster.jpg/640px-Reefer_madness_poster.jpg',
  'Utopia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Atoll_K_poster.jpg/640px-Atoll_K_poster.jpg',
  'The Bat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/The_Bat_1959.jpg/640px-The_Bat_1959.jpg',
  '20,000 Leagues Under the Sea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/20000_Leagues_Under_the_Sea_1916_poster.jpg/640px-20000_Leagues_Under_the_Sea_1916_poster.jpg',
  'The Lost World': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_Lost_World_%281925_poster%29.jpg/640px-The_Lost_World_%281925_poster%29.jpg',
  'White Zombie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/White_Zombie_poster.jpg/640px-White_Zombie_poster.jpg',
  'The Terror': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/The_Terror_%281963%29_poster.jpg/640px-The_Terror_%281963%29_poster.jpg',
  'The Brain That Wouldn\'t Die': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/The_Brain_That_Wouldnt_Die_poster.jpg/640px-The_Brain_That_Wouldnt_Die_poster.jpg',
  'Dementia 13': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Dementia_13_poster.jpg/640px-Dementia_13_poster.jpg',
  'The Manxman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/The_Manxman_poster.jpg/640px-The_Manxman_poster.jpg',
  'Royal Wedding': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Royal_Wedding_poster.jpg/640px-Royal_Wedding_poster.jpg',
  'Father\'s Little Dividend': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Father%27s_Little_Dividend_poster.jpg/640px-Father%27s_Little_Dividend_poster.jpg',
  'Life with Father': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Life_with_Father_poster.jpg/640px-Life_with_Father_poster.jpg',
  'His New Job': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/His_New_Job_%281915%29_poster.jpg/640px-His_New_Job_%281915%29_poster.jpg'
};

let matchedCount = 0;
for (const film of films) {
  // Normalize title
  const normTitle = film.title.trim().replace(/^Das Kabinett.*The Cabinet of Dr\. Caligari.*/i, 'The Cabinet of Dr. Caligari').replace(/CUKESIM's New Job! \( Charles Chaplin-1915\)/i, 'His New Job');
  film.title = normTitle;

  // Check if we have an exact poster match
  for (const [key, posterUrl] of Object.entries(posterMap)) {
    if (film.title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(film.title.toLowerCase())) {
      film.thumbnail = posterUrl;
      film.backdrop = posterUrl;
      matchedCount++;
      break;
    }
  }
}

console.log(`Matched ${matchedCount} films with exact theatrical posters!`);
fs.writeFileSync('./src/data/films.json', JSON.stringify(films, null, 2));
console.log('Saved updated films.json');
