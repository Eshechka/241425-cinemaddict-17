import { render, remove, RenderPosition } from '../framework/render.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import PopupView from '../view/popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';

import CommentsView from '../view/comments-view.js';
import CommentListView from '../view/comments-list-view.js';
import CommentView from '../view/comment-view.js';

import EmptyFilmsListView from '../view/empty-films-list-view.js';

const FILMS_AMOUNT = 5;

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #comments = [];

  #renderedCardsCount = FILMS_AMOUNT;

  constructor(filmsContainer, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];

    this.#films.forEach((film) => {
      film.comments = this.#comments.filter((comment) => comment.filmId === film.id);
    });

    this.#renderFilms();
  };

  #renderFilms = () => {
    // рендерим общий контейнер для всех списков фильмов
    const films = new FilmsView();

    render(films, this.#filmsContainer);

    const filmsListContainer = films.element;

    if (this.#films.length > 0) {
      // рендерим компоненты под разные списки фильмов
      const filmsListAll = new FilmsListView('All movies. Upcoming', true, false);
      const filmsListTopRated = new FilmsListView('Top rated', false, true);
      const filmsListMostCommented = new FilmsListView('Most commented', false, true);

      render(filmsListAll, filmsListContainer);
      render(filmsListTopRated, filmsListContainer);
      render(filmsListMostCommented, filmsListContainer);

      // рендерим карточки фильмов в каждый список
      // all
      const allFilmsListContainer = filmsListAll.getFilmsListContainer();
      this.#renderCards(allFilmsListContainer, this.#films.slice(0, FILMS_AMOUNT));

      if (this.#films.length > this.#renderedCardsCount) {
        // show more button
        this.#renderShowMoreBtn(filmsListAll.element, allFilmsListContainer);
      }

      // top rated
      const topRatedFilmsListContainer = filmsListTopRated.getFilmsListContainer();
      this.#renderCards(topRatedFilmsListContainer, this.#films.slice(0, 1));

      // most commented
      const mostCommentedFilmsListContainer = filmsListMostCommented.getFilmsListContainer();
      this.#renderCards(mostCommentedFilmsListContainer, this.#films.slice(0, 1));
    } else {
      const emptyFilms = new EmptyFilmsListView();
      render(emptyFilms, filmsListContainer);
    }
  };

  #renderPopup = (popupFilm) => {
    const popup = new PopupView(popupFilm);
    const bodyElement = document.body;
    render(popup, bodyElement);
    bodyElement.classList.add('hide-overflow');

    const doWhenPopupClose = () => {
      popup.element.parentNode.removeChild(popup.element);
      popup.removeElement();
      bodyElement.classList.remove('hide-overflow');
    };

    popup.setCloseElementClickHandler(() => {
      doWhenPopupClose();
    });

    const closePopupByEsc = (e) => {
      e.preventDefault();
      if (e.key === 'Escape') {
        doWhenPopupClose();
        bodyElement.removeEventListener('keydown', closePopupByEsc);
      }
    };
    bodyElement.addEventListener('keydown', closePopupByEsc);

    render(new CommentsView(popupFilm.comments.length), popup.getFilmDetailsBottomContainer());

    render(new CommentListView(), popup.getFilmDetailsNewComment(), RenderPosition.BEFOREBEGIN);

    const commentListElement = popup.getFilmDetailsCommentsList();
    popupFilm.comments.forEach((comment) => render(new CommentView(comment), commentListElement));
  };

  #renderCards = (container, cards = []) => {
    if (cards.length === 0) {
      const noCards = new FilmCardView();
      render(noCards, container);

      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardInfo = cards[i];
      const cardView = new FilmCardView(cardInfo);

      render(cardView, container);

      cardView.setClickHandler(() => {
        this.#renderPopup(cardInfo);
      });
    }
  };

  #renderShowMoreBtn = (btnContainer, cardsContainer) => {
    const showMoreBtn = new ShowMoreBtnView();
    render(showMoreBtn, btnContainer);

    showMoreBtn.setClickHandler(() => {

      this.#renderCards(cardsContainer, this.#films.slice(this.#renderedCardsCount, this.#renderedCardsCount + FILMS_AMOUNT));

      if (this.#films.length > this.#renderedCardsCount + FILMS_AMOUNT) {
        this.#renderedCardsCount += FILMS_AMOUNT;
      } else {
        this.#renderedCardsCount = this.#films.length;
        remove(showMoreBtn);
      }
    });

  };

}
