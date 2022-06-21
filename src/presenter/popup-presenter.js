import { render, remove } from '../framework/render.js';
import { FilterType, UserAction } from '../helpers/common.js';

import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer = null;
  #popupComponent = null;

  #handleViewAction = null;

  #cardInfo = null;

  constructor(handleViewAction) {
    this.#handleViewAction = handleViewAction;
  }

  init = (cardInfo, isComments = false) => {
    this.#cardInfo = cardInfo;

    this.#renderPopup(isComments);
  };

  getCardPopupData = () => ({ ...this.#cardInfo });

  #renderPopup = (isComments) => {
    if (this.#popupComponent) {
      this.destroyPopup();//попап уже был отрендерен, прежде чем отрисовывать новый, надо убрать предыдущий
    }

    // создаем попап, данные зависят от того, пришла ли информация с сервера
    if (isComments) {
      this.#popupComponent = new PopupView(this.#cardInfo);
    } else {// нет полноценных комментариев
      this.#popupComponent = new PopupView({ ...this.#cardInfo, comments: null });
    }

    // рендерим попап
    this.#popupContainer = document.body;
    render(this.#popupComponent, this.#popupContainer);
    this.#popupContainer.classList.add('hide-overflow');

    this.#popupContainer.addEventListener('keydown', this.#closePopupByEsc);

    this.#popupComponent.setToggleControlHandler((_, type) => {
      // обновляем данные
      const newUserDetails = { ...this.#cardInfo.userDetails };

      switch (type) {
        case FilterType.WATCHLIST:
          newUserDetails.watchlist = !newUserDetails.watchlist;
          break;
        case FilterType.HISTORY:
          newUserDetails['alreadyWatched'] = !newUserDetails['alreadyWatched'];
          break;
        case FilterType.FAVORITE:
          newUserDetails.favorite = !newUserDetails.favorite;
          break;
        default:
          break;
      }

      // вызываем метод из film-presenter (с обновленными данными)
      const newCardInfo = Object.assign({}, { ...this.#cardInfo, userDetails: newUserDetails, comments: [] });
      this.#handleViewAction(UserAction.UPDATE_FILM, newCardInfo, 'popup');
    });

    this.#popupComponent.setSubmitAddCommentFormHandler((_, newComment) => {
      this.#handleViewAction(UserAction.ADD_COMMENT, newComment);
    });

    this.#popupComponent.setClickDeleteHandler((_, comment) => {
      this.#handleViewAction(UserAction.DELETE_COMMENT, comment);
    });

    this.#popupComponent.setCloseElementClickHandler(() => {
      this.#popupContainer.removeEventListener('keydown', this.#closePopupByEsc);
      this.destroyPopup();
    });
  };

  #closePopupByEsc = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.#popupContainer.removeEventListener('keydown', this.#closePopupByEsc);
      this.destroyPopup();
    }
  };

  destroyPopup = () => {
    // закрываем попап, очищаем this.#popupComponent
    document.removeEventListener('keydown', this.#popupComponent.submitAddCommentFormHandler);
    this.#popupContainer.removeEventListener('keydown', this.#closePopupByEsc);
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#popupContainer.classList.remove('hide-overflow');
  };

  shakePopupAddFormComment = () => {
    this.#popupComponent.shakeElement(this.#popupComponent.getNewCommentElement());
  };

  shakePopupControls = () => {
    this.#popupComponent.shakeElement(this.#popupComponent.getControlsElement());
  };

  shakePopupDeletingComment = (commentId) => {
    const commentElement = this.#popupComponent.getCommentElement(commentId);
    this.#popupComponent.shakeElement(commentElement);
  };

  updatePopupCardCommentsAfterAdd = (newComment) => {
    delete newComment.filmId;
    const newComments = [...this.#cardInfo.comments, newComment];
    this.#cardInfo.comments = newComments;
    this.#popupComponent.updateAfterAddComment(newComments);
  };

  updateFilmControlsAfterUpdate = (userDetails) => {
    this.#cardInfo.userDetails = { ...userDetails };
    this.#popupComponent.updateAfterUpdateFilm(userDetails);
  };

  updateCardCommentsAfterFailureDelete = () => {
    this.#popupComponent.updateAfterFailureDeleteComment();
  };

  updateCardCommentsAfterDelete = (newComments) => {
    this.#cardInfo.comments = newComments;
    this.#popupComponent.updateAfterDeleteComment(newComments);
  };

}
