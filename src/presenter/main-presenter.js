import { render, replace } from '../framework/render.js';

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

import FilmsApiService from '../films-api-service.js';

const AUTHORIZATION = 'Basic li_du_sha_739';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

export default class MainPresenter {
  #filmsModel = new FilmModel(new FilmsApiService(END_POINT, AUTHORIZATION));
  #commentModel = new CommentModel(new FilmsApiService(END_POINT, AUTHORIZATION));
  #filterModel = new FiltertModel();

  #titleViewComponent = new TitleView();
  #statisticsViewComponent = new StatisticsView();

  init = () => {

    render(this.#titleViewComponent, siteHeaderElement);

    new FiltersPresenter(siteMainElement, this.#filmsModel, this.#filterModel).init();

    new FilmsPresenter(siteMainElement, this.#filmsModel, this.#commentModel, this.#filterModel).init();

    this.#filmsModel.init();

    render(this.#statisticsViewComponent, siteFooterStatisticsElement);

    this.#filmsModel.addObserver(this.#handleModelEvent);
  };

  #handleModelEvent = (updateType, data) => {
    // запоминаем предыдущий cardComponent
    const prevTitleViewComponent = this.#titleViewComponent;
    const prevStatisticsViewComponent = this.#statisticsViewComponent;

    switch (updateType) {
      case 'INIT':
        this.#titleViewComponent = new TitleView(this.#countWatched(data));
        // заменяем разметку
        replace(this.#titleViewComponent, prevTitleViewComponent);

        this.#statisticsViewComponent = new StatisticsView(data.length);
        // заменяем разметку
        replace(this.#statisticsViewComponent, prevStatisticsViewComponent);
        break;
      case 'UPDATE_FILM':
        this.#titleViewComponent = new TitleView(this.#countWatched(this.#filmsModel.films));
        // заменяем разметку
        replace(this.#titleViewComponent, prevTitleViewComponent);
        break;
    }
  };

  #countWatched = (films) => films.reduce((sum, film) => sum + film.userDetails.already_watched, 0);

}
