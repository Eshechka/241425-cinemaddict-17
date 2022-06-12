import dayjs from 'dayjs';
import { getRandomInteger } from '../helpers/common.js';

const emojiSrcs = [
  './images/emoji/smile.png',
  './images/emoji/angry.png',
  './images/emoji/puke.png',
  './images/emoji/sleeping.png',
];
const commentTexts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];
const authors = [
  'Tim Macoveev',
  'John Doe',
  'Elon Mask',
];
const generateDate = () => {

  const daysGap = getRandomInteger(-60, 0);
  const date = dayjs().add(daysGap, 'day').toDate();

  return date;
};

export const generateComments = (filmsAmount = 10) => {

  const comments = [];

  const commentsAmount = getRandomInteger(filmsAmount, filmsAmount * 3);
  for (let i = 1; i <= commentsAmount; i++) {
    comments.push({
      id: i,
      author: authors[getRandomInteger(0, authors.length - 1)],
      text: commentTexts[getRandomInteger(0, commentTexts.length - 1)],
      filmId: getRandomInteger(1, filmsAmount),
      date: generateDate(),
      emojiSrc: emojiSrcs[getRandomInteger(0, emojiSrcs.length - 1)],
    });
  }

  return comments;
};
