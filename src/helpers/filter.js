import { generateFilterTypeFilms } from '../mock/filter';
import { FILMS_AMOUNT } from '../model/film-model';

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const filterUserFilterList = (filmsList, loginUserId) =>
  filmsList.filter((film) => film.userId === loginUserId);

const userWatchFilmsList = filterUserFilterList(generateFilterTypeFilms(), 1);
const userHistoryFilmsList = filterUserFilterList(generateFilterTypeFilms(), 1);
const userFavoritesFilmsList = filterUserFilterList(generateFilterTypeFilms(), 1);

export const filtersFilms = {
  [FilterType.ALL]: FILMS_AMOUNT,
  [FilterType.WATCHLIST]: userWatchFilmsList.length,
  [FilterType.HISTORY]: userHistoryFilmsList.length,
  [FilterType.FAVORITES]: userFavoritesFilmsList.length,
};
