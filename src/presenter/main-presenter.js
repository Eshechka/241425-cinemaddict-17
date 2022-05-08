import TitleView from '../view/title-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import PopupView from '../view/popup-view.js';


import { render } from '../render.js';
import FilmsPresenter from './films-presenter.js';


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


export default class MainPresenter {


  init = () => {
    render(new TitleView(), siteHeaderElement);
    render(new MainNavigationView(), siteMainElement);
    render(new SortView(), siteMainElement);

    new FilmsPresenter(siteMainElement).init();

    render(new StatisticsView(), siteFooterStatisticsElement);
    render(new PopupView(), document.documentElement);
  };

}
