import Observable from '../framework/observable.js';

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
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify('INIT', this.#films);
  };


  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      ['film_info']: {
        ...film.film_info,
        alternativeTitle: film.film_info['alternative_title'],
        rating: film.film_info['total_rating'],
        imgSrc: film.film_info['poster'],
        ageRating: film.film_info['age_rating'],
        duration: film.film_info['runtime'],
      },
      userDetails: film['user_details'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info['alternative_title'];
    delete adaptedFilm.film_info['total_rating'];
    delete adaptedFilm.film_info['poster'];
    delete adaptedFilm.film_info['age_rating'];
    delete adaptedFilm.film_info['runtime'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  };

  set films(films) {
    this.#films = films;
  }

  get films() {
    return this.#films;
  }



  updateFilm = (updatedFilm) => {
    const ndx = this.films.findIndex((film) => film.id === updatedFilm.id);

    if (ndx === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.films = [
      ...this.films.slice(0, ndx),
      updatedFilm,
      ...this.films.slice(ndx + 1),
    ];

    this._notify('UPDATE_FILM', updatedFilm);
  };
}
