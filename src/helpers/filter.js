
const countFilter = (type = '', films = []) => {
  if (!type) {
    return 0;
  }
  return films.filter((film) => film.userDetails[type]).length;
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const filtersFilms = (films) => {
  const allFilmsLength = films.length;
  return {
    [FilterType.ALL]: allFilmsLength,
    [FilterType.WATCHLIST]: countFilter('watchlist', films),
    [FilterType.HISTORY]: countFilter('already_watched', films),
    [FilterType.FAVORITES]: countFilter('favorite', films),
  };
};

