import { render, remove, RenderPosition } from '../framework/render.js';
import { updateItem, sortRating, sortDate } from '../helpers/common.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';

import ShowMoreBtnView from '../view/show-more-btn-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';
import CardPresenter from './card-presenter.js';
import SortView from '../view/sort-view.js';

const FILMS_AMOUNT = 5;

export default class FilmsPresenter {
  #films = [];
  #defaultSortedFilms = [];

  #filmsContainer = null;

  #filmsComponent = null;
  #emptyFilmsComponent = null;
  #allFilmsComponent = null;
  #topRatedFilmsComponent = null;
  #mostCommentedFilmsComponent = null;
  #showMoreAllFilmsBtnComponent = null;
  #sortComponent = null;

  #sortingMode = 'default';

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
    this.#defaultSortedFilms = [...this.#films];

    this.#filmsComponent = new FilmsView();
    this.#emptyFilmsComponent = new EmptyFilmsListView();
    this.#allFilmsComponent = new FilmsListView('All movies. Upcoming', true, false);
    this.#topRatedFilmsComponent = new FilmsListView('Top rated', false, true);
    this.#mostCommentedFilmsComponent = new FilmsListView('Most commented', false, true);
    this.#showMoreAllFilmsBtnComponent = new ShowMoreBtnView();

    this.#sortComponent = new SortView();

    if (this.#films.length > 0) {
      this.#renderSorting();
    }

    // рендерим общий контейнер для всех списков фильмов
    render(this.#filmsComponent, this.#filmsContainer);

    this.#renderFilms();
  };

  #renderSorting = () => {
    render(this.#sortComponent, this.#filmsContainer);
    // добавим обработчик клика на компонент
    this.#sortComponent.setClickSortingHandler(this.#clickSorting);
  };

  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderEmptyFilmsComponent();
      return;
    }

    // рендерим компоненты под разные списки фильмов
    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.#films, this.#renderedAllCardsCount);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.#films, this.#cardPresenterAll, this.#renderedAllCardsCount);

    this.#renderFilmsComponent(this.#topRatedFilmsComponent, this.#cardPresenterTopRated, this.#films, 2);

    this.#renderFilmsComponent(this.#mostCommentedFilmsComponent, this.#cardPresenterMostCommented, [this.#films[1]]);
  };

  #renderEmptyFilmsComponent = () => {
    render(this.#emptyFilmsComponent, this.#filmsComponent.element);
  };

  // рендерит компоненты списка фильмов
  #renderFilmsComponent = (filmsListComponent, cardPresenterMap, films, amountFirstRender = 1, place = RenderPosition.BEFOREEND) => {
    render(filmsListComponent, this.#filmsComponent.element, place);
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
      const cardPresenter = new CardPresenter(container, this.#clickControlFilm, this.#hidePopup);

      // добавляем отрисованные cardPresenter-ы в cardPresenterMap
      cardPresenterMap.set(cards[i].id, cardPresenter);

      cardPresenter.init(cards[i]);
    }
  };

  #renderShowMoreBtn = (showMoreBtn, btnContainer, cardsContainer, films, cardPresenterMap, amountRenderPerStep = 1) => {
    if (films.length <= amountRenderPerStep) {
      return;
    }

    // const showMoreBtn = new ShowMoreBtnView();
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

  // колбек, передаваемый в #sortComponent, сортирует и перерисовывает фильмы по клику на контрол сортировки
  #clickSorting = (type) => {

    if (this.#sortingMode === type) {
      return;
    }
    // запоминаем тип сортировки
    this.#sortingMode = type;

    // подсвечиваем нажатый фильтр
    this.#sortComponent.setActiveSortingElement(type);


    this.#sortFilms();

    // удаляем все презентеры карточек фильмов и очищаем мап
    this.#clearAllFilmList();

    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.#films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.#films, this.#cardPresenterAll, this.#renderedAllCardsCount);
  };

  #sortFilms = () => {
    switch (this.#sortingMode) {
      case 'date':
        this.#films.sort(sortDate);
        break;
      case 'rating':
        this.#films.sort(sortRating);
        break;
      default:
        this.#films = [...this.#defaultSortedFilms];
        break;
    }
  };

  #clearAllFilmList = () => {
    this.#cardPresenterAll.forEach((presenter) => presenter.destroyCard());
    this.#cardPresenterAll.clear();
    remove(this.#showMoreAllFilmsBtnComponent);
  };

  #clickControlFilm = (updatedCard) => {
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
