import { render, replace, remove } from '../framework/render.js';

import FilmCardView from '../view/film-card-view.js';

export default class CardPresenter {
  #cardsContainer = null;
  #cardComponent = null;

  #handleViewAction = null;
  #initPopup = null;

  #commentsModel = null;

  #cardInfo = null;

  #isLoading = true;

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
      this.#handleViewAction('UPDATE_FILM', { ...this.#cardInfo, userDetails: newUserDetails, comments: [] }, 'card');
    });
  };

  #renderCard = () => {
    render(this.#cardComponent, this.#cardsContainer);
  };

  destroyCard = () => {
    remove(this.#cardComponent);
    this.#cardComponent = null;
  };

  updateCardComments = (newComments) => {
    this.#isLoading = false;

    const updatedComments = this.#cardInfo.comments.map((commentId, ndx) =>
      ({ id: commentId, ...newComments[ndx] })
    );

    this.#cardInfo.comments = updatedComments;
  };

  cardComponentShake = () => {
    this.#cardComponent.shake(() => { });
  };

}
