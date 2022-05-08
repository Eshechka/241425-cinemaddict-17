
import cardsModel from '../model/cards-model.js';
import { render } from '../render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';


export default class FilmsPresenter {
  #filmsContainer = null;

  #cards = [];

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = () => {
    this.#cards = [...cardsModel];

    this.#renderFilms();
  };


  #renderFilms = () => {
    render(new FilmsView(), this.#filmsContainer);

    const allFilmListsContainer = document.querySelector('.films');

    render(new FilmsListView('All movies. Upcoming', true, false, this.#cards, 5, true), allFilmListsContainer);
    render(new FilmsListView('Top rated', false, true, this.#cards), allFilmListsContainer);
    render(new FilmsListView('Most commented', false, true, this.#cards), allFilmListsContainer);

  };

}
