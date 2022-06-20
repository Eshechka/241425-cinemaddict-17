import { render, remove, RenderPosition, replace } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortRating, sortDate, getRandomInteger } from '../helpers/common.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import LoadingView from '../view/loading-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';
import CardPresenter from './card-presenter.js';
import SortView from '../view/sort-view.js';
import PopupPresenter from './popup-presenter.js';

const FILMS_AMOUNT = 5;
const EMPTY_TITLES = {
  'all': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'already_watched': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now',
};
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
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
  #popupComponent = null;
  #loadingComponent = new LoadingView();

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #sortingMode = 'default';
  #filterType = 'all';

  #isLoading = true;
  #updateFilmFrom = null;

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
    this.#popupComponent = new PopupPresenter(this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderFilms();
  };

  get films() {
    this.#filterType = this.#filterModel.filter;

    const filteredFilms = this.#getFilteredFilms(this.#filterType, [...this.#films]);

    switch (this.#sortingMode) {
      case 'date':
        return filteredFilms.sort(sortDate);
      case 'rating':
        return filteredFilms.sort(sortRating);
    }

    return filteredFilms;
  }

  get topRatedFilms() {
    if (!this.#filmsModel.films.length) {
      return [];
    }
    const topRatedFilms = [...this.#filmsModel.films].sort(sortRating);

    // у всех рейтинг 0, не отображаем фильмы
    if (!topRatedFilms[0].film_info.rating) {
      return [];
    }
    // только один фильм, возвращаем его
    if (topRatedFilms.length === 1) {
      return [];
    }
    // у всех равный рейтинг, берем 2 случайных
    if (topRatedFilms[0].film_info.rating === topRatedFilms[topRatedFilms.length - 1].film_info.rating) {
      return [
        ...topRatedFilms.splice(getRandomInteger(0, topRatedFilms.length - 1), 1),
        ...topRatedFilms.splice(getRandomInteger(0, topRatedFilms.length - 1), 1)
      ];
    }

    return topRatedFilms.slice(0, 2);
  }


  #getFilteredFilms = (type = 'all', films = []) => {
    if (type === 'all') {
      return films;
    }

    return films.filter((film) => film.userDetails[type] === true);
  };

  // Обновляет данные фильма
  #setFilms = () => {
    this.#films = this.#filmsModel.films;
  };

  #renderSorting = () => {
    render(this.#sortComponent, this.#filmsContainer);
    // добавим обработчик клика на компонент
    this.#sortComponent.setClickSortingHandler(this.#clickSorting);
  };

  #renderFilms = () => {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    // рендерим компоненты под разные списки фильмов
    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);

    this.#renderFilmsComponent(this.#topRatedFilmsComponent, this.#cardPresenterTopRated, this.topRatedFilms, this.topRatedFilms.length);

    this.#renderFilmsComponent(this.#mostCommentedFilmsComponent, this.#cardPresenterMostCommented, [...this.#films], 2);
  };

  // рендерит компоненты списка фильмов
  #renderFilmsComponent = (filmsListComponent, cardPresenterMap, films, amountFirstRender = 1, place = RenderPosition.BEFOREEND) => {
    render(filmsListComponent, this.#filmsComponent.element, place);
    if (films.length) {
      if (this.#emptyFilmsComponent) {
        remove(this.#emptyFilmsComponent);
      }
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
      const cardPresenter = new CardPresenter(container, this.#handleViewAction, this.#initPopup, this.#commentsModel);

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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsContainer, RenderPosition.BEFOREEND);
  };

  #initPopup = (cardInfo, isComments) => {
    this.#popupComponent.init(cardInfo, isComments);
  };

  #handleViewAction = async (typeAction, changed, from = null) => {
    this.#uiBlocker.block();
    this.#updateFilmFrom = from;

    switch (typeAction) {
      case 'UPDATE_FILM':
        try {
          await this.#filmsModel.updateFilm(changed);//updatedFilm
        } catch (error) {
          if (from === 'card') {
            [this.#cardPresenterAll, this.#cardPresenterTopRated, this.#cardPresenterMostCommented].forEach((presenterSet) => {
              if (presenterSet.has(changed.id)) {
                presenterSet.get(changed.id).cardComponentShake();
              }
            });
          } else if (from === 'popup') {
            this.#popupComponent.shakePopupControls();
          }
        }
        break;
      case 'ADD_COMMENT':
        try {
          await this.#commentsModel.addComment(changed);//addedComment
        } catch (error) {
          this.#popupComponent.shakePopupAddFormComment();
        }
        break;
      case 'DELETE_COMMENT':
        try {
          await this.#commentsModel.deleteComment(changed);//deletedComment
        } catch (error) {
          this.#popupComponent.updateCardCommentsAfterFailureDelete();
          this.#popupComponent.shakePopupDeletingComment(changed.id);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case 'INIT':
        this.#isLoading = false;
        remove(this.#loadingComponent);

        this.#setFilms();

        if (this.films.length) {
          this.#renderSorting();
        }
        // рендерим общий контейнер для всех списков фильмов
        render(this.#filmsComponent, this.#filmsContainer);

        this.#renderFilms();
        break;
      case 'GET_FILM_COMMENTS':
        if (data.comments) {//если комменты не удалось обновить, они будут null
          this.#initPopup(data, true);
        }
        break;
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
        if (this.#updateFilmFrom === 'popup') {
          this.#popupComponent.updateFilmControlsAfterUpdate(data.userDetails);
        }
        this.#updateFilmFrom = null;
        // если в мапе (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) есть элемент с таким id, обновляем его
        this.#rerenderMapElement(this.#cardPresenterAll.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterTopRated.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterMostCommented.get(data.id), data);

        this.#setFilms();

        if (this.#filterType !== 'all') {
          this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);
          this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
          this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);
        }
        this.#emptyFilmsComponent.setTitle(EMPTY_TITLES[this.#filterType]);
        break;
      case 'ADD_COMMENT':
        this.#popupComponent.updatePopupCardCommentsAfterAdd(data);
        // если в мапе (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) есть элемент с таким filmId, обновляем его
        this.#rerenderMapElement(this.#cardPresenterAll.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());
        this.#rerenderMapElement(this.#cardPresenterTopRated.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());
        this.#rerenderMapElement(this.#cardPresenterMostCommented.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());

        this.#setFilms();
        break;
      case 'DELETE_COMMENT':
        this.#popupComponent.updateCardCommentsAfterDelete(data);
        // если в мапе (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) есть элемент с таким filmId, обновляем его
        this.#rerenderMapElement(this.#cardPresenterAll.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());
        this.#rerenderMapElement(this.#cardPresenterTopRated.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());
        this.#rerenderMapElement(this.#cardPresenterMostCommented.get(this.#popupComponent.getCardPopupData().id), this.#popupComponent.getCardPopupData());

        this.#setFilms();
        break;
    }
  };

}
