import { render, replace, remove } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';

export default class CardPresenter {
  #cardsContainer = null;
  #popupContainer = null;
  #cardComponent = null;
  #popupComponent = null;

  #handleViewAction = null;
  #hidePopup = null;

  #commentsModel = null;

  #cardInfo = null;

  #isLoading = true;

  constructor(cardsContainer, handleViewAction, hidePopup, commentsModel) {
    this.#cardsContainer = cardsContainer;

    this.#commentsModel = commentsModel;

    this.#handleViewAction = handleViewAction;
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
      this.#commentsModel.init(this.#cardInfo.id);
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

      // вызываем метод из презентера films, который вызовет метод модели filmsModel (с обновленными данными)
      this.#handleViewAction('UPDATE_FILM', { ...this.#cardInfo, userDetails: newUserDetails, comments: [] });
    });
  };

  #renderCard = () => {
    render(this.#cardComponent, this.#cardsContainer);
  };

  destroyCard = () => {
    remove(this.#cardComponent);
    this.#cardComponent = null;
  };

  getCardData = () => {
    const data = { ...this.#cardInfo };
    return data;
  };

  #renderPopup = (popupFilm) => {
    this.#hidePopup(this);

    // создаем попап, данные зависят от того, пришла ли информация с сервера
    if (this.#isLoading) {
      this.#popupComponent = new PopupView({ ...popupFilm, comments: null });
    } else {
      this.#popupComponent = new PopupView(popupFilm);
    }

    // рендерим попап
    this.#popupContainer = document.body;
    render(this.#popupComponent, this.#popupContainer);
    this.#popupContainer.classList.add('hide-overflow');

    const closePopupByEsc = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.destroyPopup();
        this.#popupContainer.removeEventListener('keydown', closePopupByEsc);
      }
    };

    this.#popupContainer.addEventListener('keydown', closePopupByEsc);

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
      const newCardInfo = Object.assign({}, { ...this.#cardInfo, userDetails: newUserDetails, comments: [] });
      this.#handleViewAction('UPDATE_FILM', newCardInfo);
    });

    this.#popupComponent.setSubmitAddCommentFormHandler((_, newComment) => {
      this.#handleViewAction('ADD_COMMENT', newComment);
    });

    this.#popupComponent.setClickDeleteHandler((_, comment) => {
      this.#handleViewAction('DELETE_COMMENT', comment);
    });

    this.#popupComponent.setCloseElementClickHandler(() => {
      this.destroyPopup();
      this.#popupContainer.removeEventListener('keydown', closePopupByEsc);
    });
  };

  destroyPopup = () => {
    // закрываем попап, очищаем this.#popupComponent
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#popupContainer.classList.remove('hide-overflow');
  };

  updateCardComments = (newComments) => {
    this.#isLoading = false;

    const updatedComments = this.#cardInfo.comments.map((commentId, ndx) =>
      ({ id: commentId, ...newComments[ndx] })
    );

    this.#cardInfo.comments = updatedComments;

    this.#renderPopup(this.#cardInfo);

  };

  shakePopupAddFormComment = () => {
    this.#popupComponent.shakeElement(this.#popupComponent.getNewCommentElement());
  };

  shakePopupDeletingComment = (commentId) => {
    const commentElement = this.#popupComponent.getCommentElement(commentId);
    this.#popupComponent.shakeElement(commentElement);
  };

  cardComponentShake = () => {
    this.#cardComponent.shake(() => { });
  };

  updateCardCommentsAfterAdd = () => {
    this.#popupComponent.updateAfterAddComment();
  };

  updateCardCommentsAfterDelete = (comment) => {
    this.#popupComponent.updateAfterDeleteComment(comment);
  };

}
