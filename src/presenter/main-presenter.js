import TitleView from '../view/title-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import PopupView from '../view/popup-view.js';

import FilmModel from '../model/film-model.js';
import CommentModel from '../model/comment-model.js';


import { render } from '../render.js';
import FilmsPresenter from './films-presenter.js';
import CommentsPresenter from './commets-presenter.js';
import { getRandomInteger } from '../helpers/common.js';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


export default class MainPresenter {

  init = () => {
    render(new TitleView(), siteHeaderElement);
    render(new MainNavigationView(), siteMainElement);
    render(new SortView(), siteMainElement);

    const filmModel = new FilmModel();
    new FilmsPresenter(siteMainElement, filmModel).init();

    render(new StatisticsView(), siteFooterStatisticsElement);

    const popupFilm = filmModel.films[getRandomInteger(1, filmModel.films.length - 1)];
    render(new PopupView(popupFilm), document.documentElement);

    const sitePopupCommentsElement = document.querySelector('.film-details__bottom-container');
    new CommentsPresenter(sitePopupCommentsElement, new CommentModel(), popupFilm.id).init();
  };

}
