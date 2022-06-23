import { render, replace, remove } from '../framework/render.js';
import { FilterType, UserAction } from '../helpers/common.js';

import FilmCardView from '../view/film-card-view.js';

export default class CardPresenter {
  #cardsContainer = null;
  #cardComponent = null;

  #handleViewAction = null;
  #initPopup = null;

  #commentsModel = null;

  #cardInfo = null;

  constructor(cardsContainer, handleViewAction, initPopup, commentsModel) {
    this.#cardsContainer = cardsContainer;

    this.#commentsModel = commentsModel;

    this.#handleViewAction = handleViewAction;
    this.#initPopup = initPopup;
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
      this.#commentsModel.init(this.#cardInfo);
      this.#initPopup(this.#cardInfo, false);// тут еще нет полноценных комментариев, но надо отрендерить попап, поэтому отправляем без них
    });

    this.#cardComponent.setToggleControlHandler((_, type) => {
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

      // вызываем метод из презентера films, который вызовет метод модели filmsModel (с обновленными данными)
      this.#handleViewAction(UserAction.UPDATE_FILM, { ...this.#cardInfo, userDetails: newUserDetails, comments: [] }, 'card');
    });
  };

  updateCardComments = (newComments) => {

    const updatedComments = this.#cardInfo.comments.map((commentId, index) =>
      ({ id: commentId, ...newComments[index] })
    );

    this.#cardInfo.comments = updatedComments;
  };

  cardComponentShake = () => {
    this.#cardComponent.shake(() => { });
  };

  destroyCard = () => {
    remove(this.#cardComponent);
    this.#cardComponent = null;
  };

  #renderCard = () => {
    render(this.#cardComponent, this.#cardsContainer);
  };
}
