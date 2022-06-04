import { render, replace, RenderPosition, remove } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import CommentsView from '../view/comments-view.js';
import CommentListView from '../view/comments-list-view.js';
import CommentView from '../view/comment-view.js';

export default class CardPresenter {
  #cardsContainer = null;
  #popupContainer = null;
  #cardComponent = null;
  #popupComponent = null;

  #clickControlFilm = null;
  #hidePopup = null;

  #cardInfo = null;

  constructor(cardsContainer, clickControlFilm, hidePopup) {
    this.#cardsContainer = cardsContainer;
    this.#clickControlFilm = clickControlFilm;
    this.#hidePopup = hidePopup;
  }

  init = (cardInfo) => {
    this.#cardInfo = cardInfo;

    // запоминаем предыдущий cardComponent
    const prevCardComponent = this.#cardComponent;
    this.#cardComponent = new FilmCardView(cardInfo);

    if (!prevCardComponent) {
      // нет prevCardComponent, это первый рендер
      this.#renderCard();
    } else {
      // есть prevCardComponent, заменяем разметку
      replace(this.#cardComponent, prevCardComponent);
    }

    this.#cardComponent.setClickHandler(() => {
      this.#hidePopup(this);
      this.#renderPopup(this.#cardInfo);
    });

    this.#cardComponent.setToggleControlHandler((_, type) => {
      // обновляем данные
      const newUserDetails = { ...this.#cardInfo.userDetails };

      switch (type) {
        case 'watchlist':
          newUserDetails.watchlist = !newUserDetails.watchlist;
          break;
        case 'already_watched':
          newUserDetails['already_watched'] = !newUserDetails['already_watched'];
          break;
        case 'favorite':
          newUserDetails.favorite = !newUserDetails.favorite;
          break;
        default:
          break;
      }

      // вызываем метод из film-presenter (с обновленными данными)
      this.#clickControlFilm({ ...this.#cardInfo, userDetails: newUserDetails });
    });
  };

  #renderCard = () => {
    render(this.#cardComponent, this.#cardsContainer);
  };

  destroyCard = () => {
    remove(this.#cardComponent);
    this.#cardComponent = null;
  };

  #renderPopup = (popupFilm) => {

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(popupFilm);

    this.#popupContainer = document.body;

    if (!prevPopupComponent) {
      // нет prevPopupComponent, это первый рендер

      render(this.#popupComponent, this.#popupContainer);
      this.#popupContainer.classList.add('hide-overflow');

    } else {
      // есть prevPopupComponent, заменяем разметку
      replace(this.#popupComponent, prevPopupComponent);
    }

    this.#popupComponent.setToggleControlHandler((_, type) => {
      // обновляем данные
      const newUserDetails = { ...this.#cardInfo.userDetails };

      switch (type) {
        case 'watchlist':
          newUserDetails.watchlist = !newUserDetails.watchlist;
          break;
        case 'already_watched':
          newUserDetails['already_watched'] = !newUserDetails['already_watched'];
          break;
        case 'favorite':
          newUserDetails.favorite = !newUserDetails.favorite;
          break;
        default:
          break;
      }

      // вызываем метод из film-presenter (с обновленными данными)
      const newCardInfo = Object.assign({}, { ...this.#cardInfo, userDetails: newUserDetails });
      this.#clickControlFilm(newCardInfo);
      this.#renderPopup(newCardInfo);
    });

    this.#popupComponent.setCloseElementClickHandler(() => {
      this.destroyPopup();
    });

    const closePopupByEsc = (e) => {
      e.preventDefault();
      if (e.key === 'Escape') {
        this.destroyPopup();
        this.#popupContainer.removeEventListener('keydown', closePopupByEsc);
      }
    };
    this.#popupContainer.addEventListener('keydown', closePopupByEsc);

    render(new CommentsView(popupFilm.comments.length), this.#popupComponent.getFilmDetailsBottomContainerElement());
    render(new CommentListView(), this.#popupComponent.getFilmDetailsNewCommentElement(), RenderPosition.BEFOREBEGIN);

    const commentListElement = this.#popupComponent.getFilmDetailsCommentsListElement();
    popupFilm.comments.forEach((comment) => render(new CommentView(comment), commentListElement));
  };

  destroyPopup = () => {
    // закрываем попап, очищаем this.#popupComponent
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#popupContainer.classList.remove('hide-overflow');
  };

}
