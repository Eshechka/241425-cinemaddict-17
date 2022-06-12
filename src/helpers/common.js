import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortRating = (filmA, filmB) => filmB.rating - filmA.rating;

export const sortDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmB.release.date, filmA.release.date);

  return weight ?? dayjs(filmB.release.date).diff(dayjs(filmA.release.date));
};
