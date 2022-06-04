import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const capitalizeStr = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
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

export const sortWatchingRatingUp = (filmA, filmB) => filmA.rating - filmB.rating;

export const sortWatchingRatingDown = (filmA, filmB) => filmB.rating - filmA.rating;

export const sortWatchingDateUp = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.userDetails.watching_date, filmB.userDetails.watching_date);

  return weight ?? dayjs(filmA.userDetails.watching_date).diff(dayjs(filmB.userDetails.watching_date));
};

export const sortWatchingDateDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.userDetails.watching_date, filmB.userDetails.watching_date);

  return weight ?? dayjs(filmB.userDetails.watching_date).diff(dayjs(filmA.userDetails.watching_date));
};
