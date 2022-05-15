import { getRandomInteger } from '../helpers/common.js';

const generateTitle = () => {
  const titles = [
    'Santa Claus Conquers the Martians',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Dance of Life',
  ];
  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'Comedy',
    'Western',
    'Drama',
    'Cartoon',
    'Musical',
  ];
  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateDuration = () => {
  const randomHour = getRandomInteger(0, 5);
  const randomMin = getRandomInteger(0, 59);

  const hour = randomHour > 0 ? `${randomHour}h ` : '';
  const min = randomMin > 0 ? `${randomMin}min` : '1min';

  return `${hour}${min}`;
};

const generateImgSrc = () => {
  const srcs = [
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/the-dance-of-life.jpg',
  ];
  const randomIndex = getRandomInteger(0, srcs.length - 1);

  return srcs[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
    'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…',
    'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escap…',
    'Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…',
    'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…',
    'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};
let filmId = 1;

export const generateFilm = () => {
  const id = filmId++;
  return {
    id: id,
    title: generateTitle(),
    description: generateDescription(),
    rating: getRandomInteger(1, 5) + getRandomInteger(1, 5) / 10,
    year: getRandomInteger(1950, 2022),
    duration: generateDuration(),
    genre: generateGenre(),
    genreOriginal: `${generateGenre()} original`,
    сountry: 'USA',
    director: 'Anthony Mann',
    writers: 'Anne Wigton, Heinz Herald, Richard Weil',
    actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
    imgSrc: generateImgSrc(),
  };
};
