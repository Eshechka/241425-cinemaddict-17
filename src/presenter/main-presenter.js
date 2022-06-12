import { render } from '../framework/render.js';

import TitleView from '../view/title-view.js';
import StatisticsView from '../view/statistics-view.js';

import FilmModel from '../model/film-model.js';
import CommentModel from '../model/comment-model.js';
import FiltertModel from '../model/filter-model.js';

import FilmsPresenter from './films-presenter.js';
import FiltersPresenter from './filters-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


export default class MainPresenter {
  #filmModel = new FilmModel();
  #commentModel = new CommentModel();
  #filterModel = new FiltertModel();

  init = () => {

    render(new TitleView(), siteHeaderElement);

    new FiltersPresenter(siteMainElement, this.#filmModel, this.#filterModel).init();

    new FilmsPresenter(siteMainElement, this.#filmModel, this.#commentModel, this.#filterModel).init();

    render(new StatisticsView(this.#filmModel.films.length), siteFooterStatisticsElement);
  };

}
