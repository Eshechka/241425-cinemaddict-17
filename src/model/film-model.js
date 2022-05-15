import { generateFilm } from '../mock/film.js';

export const FILMS_AMOUNT = 10;

export default class FilmModel {
  #films = Array.from({ length: FILMS_AMOUNT }, generateFilm);

  get films() {
    return this.#films;
  }
}
