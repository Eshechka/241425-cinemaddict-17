
import { render } from '../render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';


export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;

  #films = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilms();
  };


  #renderFilms = () => {
    render(new FilmsView(), this.#filmsContainer);

    const allFilmListsContainer = document.querySelector('.films');

    render(new FilmsListView('All movies. Upcoming', true, false, this.#films, 5, true), allFilmListsContainer);
    render(new FilmsListView('Top rated', false, true, this.#films), allFilmListsContainer);
    render(new FilmsListView('Most commented', false, true, this.#films), allFilmListsContainer);

  };

}
