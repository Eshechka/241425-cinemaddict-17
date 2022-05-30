import { render } from '../framework/render.js';

import TitleView from '../view/title-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import SortView from '../view/sort-view.js';
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

  init = () => {
    this.#films = [...this.#filmModel.films];

    render(new TitleView(), siteHeaderElement);
    render(new MainNavigationView(filtersFilms), siteMainElement);
    if (this.#films.length > 0) {
      render(new SortView(), siteMainElement);
    }

    new FilmsPresenter(siteMainElement, this.#filmModel, this.#commentModel).init();

    render(new StatisticsView(), siteFooterStatisticsElement);
  };

}
