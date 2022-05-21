import TitleView from '../view/title-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';

import FilmModel from '../model/film-model.js';
import CommentModel from '../model/comment-model.js';

import FilmsPresenter from './films-presenter.js';

import { render } from '../render.js';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


export default class MainPresenter {

  init = () => {
    render(new TitleView(), siteHeaderElement);
    render(new MainNavigationView(), siteMainElement);
    render(new SortView(), siteMainElement);

    new FilmsPresenter(siteMainElement, new FilmModel(), new CommentModel()).init();

    render(new StatisticsView(), siteFooterStatisticsElement);
  };

}
