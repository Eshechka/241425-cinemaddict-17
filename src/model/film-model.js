import Observable from '../framework/observable.js';

import { generateFilm } from '../mock/film.js';

export const FILMS_AMOUNT = 19;

export default class FilmModel extends Observable {
  #films = Array.from({ length: FILMS_AMOUNT }, generateFilm);

  set films(films) {
    this.#films = films;
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updatedFilm) => {
    const ndx = this.#films.findIndex((film) => film.id === updatedFilm.id);

    if (ndx === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, ndx),
      updatedFilm,
      ...this.#films.slice(ndx + 1),
    ];

    this._notify('UPDATE_FILM', updatedFilm);
  };
}
