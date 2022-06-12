import { render, remove, RenderPosition, replace } from '../framework/render.js';
import { sortRating, sortDate } from '../helpers/common.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';

import ShowMoreBtnView from '../view/show-more-btn-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';
import CardPresenter from './card-presenter.js';
import SortView from '../view/sort-view.js';

const FILMS_AMOUNT = 5;
const EMPTY_TITLES = {
  'all': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'already_watched': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now',
};

export default class FilmsPresenter {
  #films = [];
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

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

  constructor(filmsContainer, filmsModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#films = [];

    this.#filmsComponent = new FilmsView();
    this.#emptyFilmsComponent = new EmptyFilmsListView();
    this.#allFilmsComponent = new FilmsListView('All movies. Upcoming', true, false);
    this.#topRatedFilmsComponent = new FilmsListView('Top rated', false, true);
    this.#mostCommentedFilmsComponent = new FilmsListView('Most commented', false, true);
    this.#showMoreAllFilmsBtnComponent = new ShowMoreBtnView();
    this.#sortComponent = new SortView();

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#setFilmsWithComments();

    if (this.films.length) {
      this.#renderSorting();
    }

    // рендерим общий контейнер для всех списков фильмов
    render(this.#filmsComponent, this.#filmsContainer);

    this.#renderFilms();
  };

  get films() {
    const filterType = this.#filterModel.filter;

    const filteredFilms = this.#getFilteredFilms(filterType, [...this.#films]);

    switch (this.#sortingMode) {
      case 'date':
        return filteredFilms.sort(sortDate);
      case 'rating':
        return filteredFilms.sort(sortRating);
    }

    return filteredFilms;
  }

  #getFilteredFilms = (type = 'all', films = []) => {
    if (type === 'all') {
      return films;
    }

    return films.filter((film) => film.userDetails[type] === true);
  };

  #setFilmsWithComments = () => {
    this.#films = this.#filmsModel.films.map((film) => {
      film.comments = this.#commentsModel.comments.filter((comment) => comment.filmId === film.id);
      return film;
    });
  };

  #renderSorting = () => {
    render(this.#sortComponent, this.#filmsContainer);
    // добавим обработчик клика на компонент
    this.#sortComponent.setClickSortingHandler(this.#clickSorting);
  };

  #renderFilms = () => {
    // рендерим компоненты под разные списки фильмов
    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);

    this.#renderFilmsComponent(this.#topRatedFilmsComponent, this.#cardPresenterTopRated, [...this.#films], 2);

    this.#renderFilmsComponent(this.#mostCommentedFilmsComponent, this.#cardPresenterMostCommented, [...this.#films], 2);
  };

  // рендерит компоненты списка фильмов
  #renderFilmsComponent = (filmsListComponent, cardPresenterMap, films, amountFirstRender = 1, place = RenderPosition.BEFOREEND) => {
    if (films.length) {
      if (this.#emptyFilmsComponent) {
        remove(this.#emptyFilmsComponent);
      }
      render(filmsListComponent, this.#filmsComponent.element, place);
      // рендерим карточки фильмов
      this.#renderCards(filmsListComponent.getFilmsListContainer(), films.slice(0, amountFirstRender), cardPresenterMap);
    } else {
      if (this.#emptyFilmsComponent) {
        replace(this.#emptyFilmsComponent, filmsListComponent);
      } else {
        render(this.#emptyFilmsComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
      }
    }
  };

  // принимает элемент (инстанс CardPresenter) в мапе и новые данные. Если элемент в мапе найден - обновляет его (заново инициализирует)
  #rerenderMapElement = (mapElement, updatedCard) => {
    if (!mapElement) {
      return;
    }
    mapElement.init(updatedCard);
  };

  #renderCards = (container, cards = [], cardPresenterMap) => {
    if (!cards.length) {
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardPresenter = new CardPresenter(container, this.#handleViewAction, this.#hidePopup);

      // добавляем отрисованные cardPresenter-ы в cardPresenterMap
      cardPresenterMap.set(cards[i].id, cardPresenter);

      cardPresenter.init(cards[i]);
    }
  };

  #renderShowMoreBtn = (showMoreBtn, btnContainer, cardsContainer, films, cardPresenterMap, amountRenderPerStep = 1) => {
    if (films.length <= amountRenderPerStep) {
      return;
    }

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

    // удаляем все презентеры карточек фильмов и очищаем мап
    this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);

    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);
  };

  #clearFilmList = (mapPresenter, btnComponent = null) => {
    mapPresenter.forEach((presenter) => presenter.destroyCard());
    mapPresenter.clear();

    if (btnComponent) {
      remove(btnComponent);
    }
  };

  #handleViewAction = (typeAction, updatedFilm) => {
    switch (typeAction) {
      case 'UPDATE_FILM':
        this.#filmsModel.updateFilm(updatedFilm);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case 'UPDATE_FILTER':
        // убираем сортировку
        this.#sortingMode = 'default';
        this.#sortComponent.setActiveSortingElement(this.#sortingMode);

        // удаляем все презентеры карточек фильмов и очищаем мап
        this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);
        this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
        this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);

        this.#emptyFilmsComponent.setTitle(EMPTY_TITLES[data]);
        break;
      case 'UPDATE_FILM':
        // если в мапе (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) есть элемент с таким id, обновляем его
        this.#rerenderMapElement(this.#cardPresenterAll.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterTopRated.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterMostCommented.get(data.id), data);

        this.#setFilmsWithComments();
        break;
    }
  };

  #hidePopup = (cardpresenter) => {
    if (this.#openedPopupCardPresenter) {
      this.#openedPopupCardPresenter.destroyPopup();
    }
    this.#openedPopupCardPresenter = cardpresenter;
  };

}
