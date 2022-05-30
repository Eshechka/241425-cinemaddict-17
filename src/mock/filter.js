import { getRandomInteger } from '../helpers/common';
import { FILMS_AMOUNT } from '../model/film-model';
const USER_ID_AMOUNT = 3;

export const generateFilterTypeFilms = () => {

  const filmsList = [];

  const filmsListCount = getRandomInteger(0, FILMS_AMOUNT);

  for (let i = 1; i <= filmsListCount; i++) {
    const newFilmId = getRandomInteger(1, filmsListCount);
    const newUserId = getRandomInteger(1, USER_ID_AMOUNT);
    if (!filmsList.some((filmId) => filmId === newFilmId)) {
      filmsList.push({
        'userId': newUserId,
        'filmId': newFilmId,
      });
    }
  }

  return filmsList;
};

