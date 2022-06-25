import dayjs from 'dayjs';

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

// CONSTANTS
export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'alreadyWatched',
  FAVORITE: 'favorite',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  INIT: 'INIT',
  GET_FILM_COMMENTS: 'GET_FILM_COMMENTS',
  UPDATE_FILTER: 'UPDATE_FILTER',
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const sortCommentsAmount = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

export const sortRating = (filmA, filmB) => filmB.filmInfo.rating - filmA.filmInfo.rating;

export const sortDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmB.filmInfo.release.date, filmA.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

export const countWatched = (films) => films.reduce((sum, film) => sum + film.userDetails.alreadyWatched, 0);
