import { render, remove, RenderPosition, replace } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortRating, sortDate, getRandomInteger, sortCommentsAmount, UserAction, UpdateType, FilterType, SortType } from '../helpers/common.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import LoadingView from '../view/loading-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';
import CardPresenter from './card-presenter.js';
import SortView from '../view/sort-view.js';
import PopupPresenter from './popup-presenter.js';

const FILMS_IN_ROW_AMOUNT = 5;
const MAX_EXTRA_FILMS_AMOUNT = 2;
const EMPTY_TITLES = {
  'all': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'alreadyWatched': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now',
};
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
const ActionFrom = {
  POPUP: 'popup',
  CARD: 'card',
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

  #sortingMode = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #isLoading = true;
  #updateFilmFrom = null;

  #cardPresenterAll = new Map();
  #cardPresenterTopRated = new Map();
  #cardPresenterMostCommented = new Map();

  #renderedAllCardsCount = FILMS_IN_ROW_AMOUNT;

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

  get films() {
    this.#filterType = this.#filterModel.filter;

    const filteredFilms = this.#getFilteredFilms(this.#filterType, [...this.#films]);

    switch (this.#sortingMode) {
      case SortType.DATE:
        return filteredFilms.sort(sortDate);
      case SortType.RATING:
        return filteredFilms.sort(sortRating);
    }

    return filteredFilms;
  }

  get topRatedFilms() {
    if (!this.#films.length) {
      return [];
    }
    const topRatedFilms = [...this.#films].sort(sortRating);

    // ?? ???????? ?????????????? 0, ???? ???????????????????? ????????????
    if (!topRatedFilms[0].filmInfo.rating) {
      return [];
    }
    // ???????????? ???????? ??????????, ???????????????????? ??????
    if (topRatedFilms.length === 1) {
      return topRatedFilms;
    }
    // ?? ???????? ???????????? ??????????????, ?????????? 2 ??????????????????
    if (topRatedFilms[0].filmInfo.rating === topRatedFilms[topRatedFilms.length - 1].filmInfo.rating) {
      return [
        ...topRatedFilms.splice(getRandomInteger(0, topRatedFilms.length - 1), 1),
        ...topRatedFilms.splice(getRandomInteger(0, topRatedFilms.length - 1), 1)
      ];
    }

    return topRatedFilms.slice(0, MAX_EXTRA_FILMS_AMOUNT);
  }

  get mostCommentedFilms() {
    if (!this.#films.length) {
      return [];
    }
    const mostCommentedFilms = [...this.#films].sort(sortCommentsAmount);

    // ?? ???????? ?????????????? 0 ????????????????????????, ???? ???????????????????? ????????????
    if (!mostCommentedFilms[0].filmInfo.rating) {
      return [];
    }
    // ???????????? ???????? ?????????? c ??????????????????????????, ???????????????????? ??????
    if (mostCommentedFilms.length === 1) {
      return mostCommentedFilms;
    }
    // ?? ???????? ???????????? ?????????? ????????????????????????, ?????????? 2 ?????????????????? ????????????
    if (mostCommentedFilms[0].comments.length === mostCommentedFilms[mostCommentedFilms.length - 1].comments.length) {
      return [
        ...mostCommentedFilms.splice(getRandomInteger(0, mostCommentedFilms.length - 1), 1),
        ...mostCommentedFilms.splice(getRandomInteger(0, mostCommentedFilms.length - 1), 1)
      ];
    }

    return mostCommentedFilms.slice(0, MAX_EXTRA_FILMS_AMOUNT);
  }

  init = () => {
    this.#renderFilms();
  };

  #getFilteredFilms = (type = FilterType.ALL, films = []) => {
    if (type === FilterType.ALL) {
      return films;
    }

    return films.filter((film) => film.userDetails[type] === true);
  };

  // ?????????????????? ???????????? ????????????
  #setFilms = (filmData = null) => {
    if (!this.#films || !this.#films.length) {
      this.#films = this.#filmsModel.films;
      return;
    }
    if (!filmData) {
      return;
    }

    const index = this.#films.findIndex((film) => film.id === filmData.id);

    if (index === -1) {
      return;
    }

    this.#films = [
      ...this.#films.slice(0, index),
      filmData,
      ...this.#films.slice(index + 1),
    ];
  };

  #renderSorting = () => {
    render(this.#sortComponent, this.#filmsContainer);
    // ?????????????? ???????????????????? ?????????? ???? ??????????????????
    this.#sortComponent.setSortingClickHandler(this.#sortingClickHandler);
  };

  #renderFilms = () => {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    // ???????????????? ???????????????????? ?????? ???????????? ???????????? ??????????????
    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);

    this.#renderFilmsComponent(this.#topRatedFilmsComponent, this.#cardPresenterTopRated, this.topRatedFilms, this.topRatedFilms.length);

    this.#renderFilmsComponent(this.#mostCommentedFilmsComponent, this.#cardPresenterMostCommented, this.mostCommentedFilms, this.mostCommentedFilms.length);
  };

  #renderCards = (container, cards = [], cardPresenterMap) => {
    if (!cards.length) {
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardPresenter = new CardPresenter(container, this.#handleViewAction, this.#initPopup, this.#commentsModel);

      // ?????????????????? ???????????????????????? cardPresenter-?? ?? cardPresenterMap
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

  // ???????????????? ???????????????????? ???????????? ??????????????
  #renderFilmsComponent = (filmsListComponent, cardPresenterMap, films, amountFirstRender = 1, place = RenderPosition.BEFOREEND) => {
    render(filmsListComponent, this.#filmsComponent.element, place);
    if (films.length) {
      if (this.#emptyFilmsComponent) {
        remove(this.#emptyFilmsComponent);
      }
      // ???????????????? ???????????????? ??????????????
      this.#renderCards(filmsListComponent.getFilmsListContainer(), films.slice(0, amountFirstRender), cardPresenterMap);
    } else {
      if (this.#emptyFilmsComponent) {
        replace(this.#emptyFilmsComponent, filmsListComponent);
      } else {
        render(this.#emptyFilmsComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
      }
    }
  };

  #rerenderFilmComponents = (updatedCardData) => {
    // ???????? ?? ???????? (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) ???????? ?????????????? ?? ?????????? filmId, ?????????????????? ??????
    [this.#cardPresenterAll, this.#cardPresenterTopRated, this.#cardPresenterMostCommented].forEach((presenterSet) => {
      this.#rerenderMapElement(presenterSet.get(updatedCardData.id), updatedCardData);
    });

    this.#setFilms(updatedCardData);
    // ?????????????? ?????? ???????????????????? ???????????????? ?????????????? ?? ?????????????? ??????
    this.#clearFilmList(this.#cardPresenterMostCommented);
    this.#renderFilmsComponent(this.#mostCommentedFilmsComponent, this.#cardPresenterMostCommented, this.mostCommentedFilms, this.mostCommentedFilms.length, RenderPosition.BEFOREEND);
  };

  // ?????????????????? ?????????????? (?????????????? CardPresenter) ?? ???????? ?? ?????????? ????????????. ???????? ?????????????? ?? ???????? ???????????? - ?????????????????? ?????? (???????????? ????????????????????????????)
  #rerenderMapElement = (mapElement, updatedCard) => {
    if (!mapElement) {
      return;
    }
    mapElement.init(updatedCard);
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

  // ????????????, ???????????????????????? ?? #sortComponent, ?????????????????? ?? ???????????????????????????? ???????????? ???? ?????????? ???? ?????????????? ????????????????????
  // ???? ???????????????? ???????????????????? ?????????????????? ????????
  #sortingClickHandler = (type) => {

    if (this.#sortingMode === type) {
      return;
    }
    // ???????????????????? ?????? ????????????????????
    this.#sortingMode = type;

    // ???????????????????????? ?????????????? ????????????
    this.#sortComponent.setActiveSortingElement(type);

    // ?????????????? ?????? ???????????????????? ???????????????? ?????????????? ?? ?????????????? ??????
    this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);

    this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
    this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);
  };

  #handleViewAction = async (typeAction, changed, from = null) => {
    this.#uiBlocker.block();
    this.#updateFilmFrom = from;

    switch (typeAction) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(changed);//updatedFilm
        } catch (error) {
          if (from === ActionFrom.CARD) {
            [this.#cardPresenterAll, this.#cardPresenterTopRated, this.#cardPresenterMostCommented].forEach((presenterSet) => {
              if (presenterSet.has(changed.id)) {
                presenterSet.get(changed.id).shakeCardComponent();
              }
            });
          } else if (from === ActionFrom.POPUP) {
            this.#popupComponent.shakePopupControls();
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(changed);//addedComment
        } catch (error) {
          this.#popupComponent.shakePopupAddFormComment();
        }
        break;
      case UserAction.DELETE_COMMENT:
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

  #handleModelEvent = (updatedType, data) => {
    switch (updatedType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        this.#setFilms();

        if (this.films.length) {
          this.#renderSorting();
        }
        // ???????????????? ?????????? ?????????????????? ?????? ???????? ?????????????? ??????????????
        render(this.#filmsComponent, this.#filmsContainer);

        this.#renderFilms();
        break;
      case UpdateType.GET_FILM_COMMENTS:
        if (data.comments) {//???????? ???????????????? ???? ?????????????? ????????????????, ?????? ?????????? null
          this.#initPopup(data, true);
        }
        break;
      case UpdateType.UPDATE_FILTER:
        // ?????????????? ????????????????????
        this.#sortingMode = SortType.DEFAULT;
        this.#sortComponent.setActiveSortingElement(this.#sortingMode);

        // ?????????????? ?????? ???????????????????? ???????????????? ?????????????? ?? ?????????????? ??????
        this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);
        this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
        this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);

        this.#emptyFilmsComponent.setTitle(EMPTY_TITLES[data]);
        break;
      case UpdateType.UPDATE_FILM:
        // ???????? ?????????? ???????????? ?? ???????? ???????????????????? ???? ???????? ?????? ???? ?????? ???????????????? ???? ????????????, ???? ?????????????????? ?????? ????????????
        if (this.#popupComponent.component && data.id === this.#popupComponent.getCardPopupData().id) {
          this.#popupComponent.updateFilmControlsAfterUpdate(data.userDetails);
        }
        this.#updateFilmFrom = null;
        // ???????? ?? ???????? (cardPresenterAll, cardPresenterTopRated, cardPresenterMostCommented) ???????? ?????????????? ?? ?????????? id, ?????????????????? ??????
        this.#rerenderMapElement(this.#cardPresenterAll.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterTopRated.get(data.id), data);
        this.#rerenderMapElement(this.#cardPresenterMostCommented.get(data.id), data);

        this.#setFilms(data);

        if (this.#filterType !== FilterType.ALL) {
          this.#clearFilmList(this.#cardPresenterAll, this.#showMoreAllFilmsBtnComponent);
          this.#renderFilmsComponent(this.#allFilmsComponent, this.#cardPresenterAll, this.films, this.#renderedAllCardsCount, RenderPosition.AFTERBEGIN);
          this.#renderShowMoreBtn(this.#showMoreAllFilmsBtnComponent, this.#allFilmsComponent.element, this.#allFilmsComponent.getFilmsListContainer(), this.films, this.#cardPresenterAll, this.#renderedAllCardsCount);
        }
        this.#emptyFilmsComponent.setTitle(EMPTY_TITLES[this.#filterType]);
        break;
      case UpdateType.ADD_COMMENT:
        this.#popupComponent.updatePopupCardCommentsAfterAdd(data);
        this.#rerenderFilmComponents(this.#popupComponent.getCardPopupData());

        break;
      case UpdateType.DELETE_COMMENT:
        this.#popupComponent.updateCardCommentsAfterDelete(data);
        this.#rerenderFilmComponents(this.#popupComponent.getCardPopupData());

        break;
    }
  };
}
