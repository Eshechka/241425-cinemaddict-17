import { render, remove } from '../framework/render.js';
import { updateItem } from '../helpers/common.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';

import ShowMoreBtnView from '../view/show-more-btn-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';
import CardPresenter from './card-presenter.js';

const FILMS_AMOUNT = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #films = [];
  #filmsComponent = null;
  #emptyFilms = null;
  #allFilms = null;
  #topRatedFilms = null;
  #mostCommentedFilms = null;

  #openedPopupCardPresenter = null;

  #cardPresenterAll = new Map();
  #cardPresenterTopRated = new Map();
  #cardPresenterMostCommented = new Map();

  #renderedAllCardsCount = FILMS_AMOUNT;

  #rerenderMainNavigation = null;

  constructor(filmsContainer, films, rerenderMainNavigation) {
    this.#filmsContainer = filmsContainer;
    this.#films = films;
    this.#rerenderMainNavigation = rerenderMainNavigation;
  }

  init = () => {
    this.#films = [...this.#films];

    this.#filmsComponent = new FilmsView();
    this.#emptyFilms = new EmptyFilmsListView();
    this.#allFilms = new FilmsListView('All movies. Upcoming', true, false);
    this.#topRatedFilms = new FilmsListView('Top rated', false, true);
    this.#mostCommentedFilms = new FilmsListView('Most commented', false, true);

    // рендерим общий контейнер для всех списков фильмов
    render(this.#filmsComponent, this.#filmsContainer);

    this.#renderFilms();
  };


  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderEmptyFilmsComponent();
      return;
    }

    // рендерим компоненты под разные списки фильмов
    this.#renderFilmsComponent(this.#allFilms, this.#cardPresenterAll, this.#films, this.#renderedAllCardsCount);
    this.#renderShowMoreBtn(this.#allFilms.element, this.#allFilms.getFilmsListContainer(), this.#films, this.#cardPresenterAll, this.#renderedAllCardsCount);

    this.#renderFilmsComponent(this.#topRatedFilms, this.#cardPresenterTopRated, this.#films, 2);

    this.#renderFilmsComponent(this.#mostCommentedFilms, this.#cardPresenterMostCommented, [this.#films[1]]);
  };

  #renderEmptyFilmsComponent = () => {
    render(this.#emptyFilms, this.#filmsComponent.element);
  };

  #renderFilmsComponent = (filmsListComponent, cardPresenterMap, films, amountFirstRender = 1) => {
    render(filmsListComponent, this.#filmsComponent.element);
    // рендерим карточки фильмов
    this.#renderCards(filmsListComponent.getFilmsListContainer(), films.slice(0, amountFirstRender), cardPresenterMap);
  };

  // принимает элемент (инстанс CardPresenter) в мапе и новые данные. Если элемент в мапе найден - обновляет его (заново инициализирует)
  #rerenderedMapElement = (mapElement, updatedCard) => {
    if (!mapElement) {
      return;
    }
    mapElement.init(updatedCard);
  };

  #renderCards = (container, cards = [], cardPresenterMap) => {
    if (cards.length === 0) {
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardPresenter = new CardPresenter(container, this.#clickWatchlist, this.#hidePopup);

      // добавляем отрисованные cardPresenter-ы в cardPresenterMap
      cardPresenterMap.set(cards[i].id, cardPresenter);

      cardPresenter.init(cards[i]);
    }
  };

  #renderShowMoreBtn = (btnContainer, cardsContainer, films, cardPresenterMap, amountRenderPerStep = 1) => {
    if (films.length <= amountRenderPerStep) {
      return;
    }

    const showMoreBtn = new ShowMoreBtnView();
    render(showMoreBtn, btnContainer);

    let renderedCardsCount = amountRenderPerStep;

    showMoreBtn.setClickHandler(() => {

      this.#renderCards(cardsContainer, films.slice(renderedCardsCount, renderedCardsCount + amountRenderPerStep), cardPresenterMap);

      if (films.length > renderedCardsCount + amountRenderPerStep) {
        renderedCardsCount += amountRenderPerStep;
      } else {
        renderedCardsCount = films.length;
        remove(showMoreBtn);
      }
    });

  };

  #clickWatchlist = (updatedCard) => {
    // кликнули на контрол, пришли данные updatedCard из card-presenter
    this.#films = updateItem(this.#films, updatedCard);

    // если в мапе (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) есть элемент с таким id, обновляем его
    this.#rerenderedMapElement(this.#cardPresenterAll.get(updatedCard.id), updatedCard);
    this.#rerenderedMapElement(this.#cardPresenterTopRated.get(updatedCard.id), updatedCard);
    this.#rerenderedMapElement(this.#cardPresenterMostCommented.get(updatedCard.id), updatedCard);

    this.#rerenderMainNavigation(this.#films);
  };

  #hidePopup = (cardpresener) => {
    if (this.#openedPopupCardPresenter) {
      this.#openedPopupCardPresenter.destroyPopup();
    }
    this.#openedPopupCardPresenter = cardpresener;
  };

}
