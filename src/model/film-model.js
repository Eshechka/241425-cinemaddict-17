import Observable from '../framework/observable.js';
import { UpdateType } from '../helpers/common.js';

export default class FilmModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.films = films.map(this.#adaptToClient);
    } catch (err) {
      this.films = [];
    }

    this._notify(UpdateType.INIT, this.films);
  };


  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film.film_info,
        alternativeTitle: film.film_info['alternative_title'],
        rating: film.film_info['total_rating'],
        imgSrc: film.film_info['poster'],
        ageRating: film.film_info['age_rating'],
        duration: film.film_info['runtime'],
        genres: film.film_info['genre'],
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film.user_details.already_watched,
      }
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['poster'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['runtime'];
    delete adaptedFilm.filmInfo['genre'];
    delete adaptedFilm.film_info;
    delete adaptedFilm['user_details'];
    delete adaptedFilm.userDetails.already_watched;

    return adaptedFilm;
  };

  set films(films) {
    this.#films = films;
  }

  get films() {
    return this.#films;
  }

  updateFilm = async (updatedFilm) => {
    const index = this.films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(updatedFilm);
      const newFilm = this.#adaptToClient(response);
      this.films = [
        ...this.films.slice(0, index),
        newFilm,
        ...this.films.slice(index + 1),
      ];

      this._notify(UpdateType.UPDATE_FILM, newFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };
}

