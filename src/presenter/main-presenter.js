import { render, replace } from '../framework/render.js';

import TitleView from '../view/title-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import StatisticsView from '../view/statistics-view.js';

import FilmModel from '../model/film-model.js';
import CommentModel from '../model/comment-model.js';

import FilmsPresenter from './films-presenter.js';
import { filtersFilms } from '../helpers/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


export default class MainPresenter {
  #filmModel = new FilmModel();
  #commentModel = new CommentModel();
  #films = [];
  #comments = [];
  #mainNavigationElement = null;

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#comments = [...this.#commentModel.comments];

    this.#films.forEach((film) => {
      film.comments = this.#comments.filter((comment) => comment.filmId === film.id);
    });

    render(new TitleView(), siteHeaderElement);

    this.#mainNavigationElement = new MainNavigationView(filtersFilms(this.#films));
    render(this.#mainNavigationElement, siteMainElement);

    new FilmsPresenter(siteMainElement, this.#films, this.#rerenderMainNavigation).init();

    render(new StatisticsView(this.#films.length), siteFooterStatisticsElement);
  };

  #rerenderMainNavigation = (updatedFilms) => {
    // кликнули на контрол, пришли данные updatedFilm из film-presenter
    this.#films = updatedFilms;

    const prevMainNavigationElement = this.#mainNavigationElement;
    this.#mainNavigationElement = new MainNavigationView(filtersFilms(this.#films));

    replace(this.#mainNavigationElement, prevMainNavigationElement);
  };

}
