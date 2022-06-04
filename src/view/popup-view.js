import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = ({ title = '', rating = '', year = '', duration = '', genre = '', imgSrc, description = '', titleOriginal = '', director = '', writers = '', actors = '', сountry = '', userDetails = {} }) => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${imgSrc}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${titleOriginal}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${year}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${сountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
                <span class="film-details__genre">${genre}</span>
                <span class="film-details__genre">${genre}</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? 'film-details__control-button--active' : ''} " id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.already_watched ? 'film-details__control-button--active' : ''} " id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''} " id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">

    </div>
  </form>
</section>
`;

export default class PopupView extends AbstractView {
  #film = null;

  constructor(film = {}) {
    super();
    this.#film = film;
  }

  get template() {
    return createTemplate(this.#film);
  }

  setCloseElementClickHandler = (callback) => {
    this._callback.clickCloseElement = callback;
    this.#getCloseElement().addEventListener('click', this.#clickCloseElementHandler);
  };

  #clickCloseElementHandler = (e) => {
    e.preventDefault();
    this._callback.clickCloseElement();
  };

  setToggleControlHandler = (callback) => {
    this._callback.toggleControl = callback;
    this.#getWatchlistElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'watchlist'));
    this.#getWatchedElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'already_watched'));
    this.#getFavoriteElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'favorite'));
  };

  #clickToggleControlHandler = (e, type) => {
    e.preventDefault();
    this._callback.toggleControl(e, type);
  };

  addHideOverflowContainer = () => {
    this.getContainerElement.classList.add('hide-overflow');
  };

  removeHideOverflowContainer = () => {
    this.getContainerElement.classList.remove('hide-overflow');
  };

  getFilmDetailsBottomContainerElement = () => this.element.querySelector('.film-details__bottom-container');

  getFilmDetailsNewCommentElement = () => this.element.querySelector('.film-details__new-comment');

  getFilmDetailsCommentsListElement = () => this.element.querySelector('.film-details__comments-list');

  #getCloseElement = () => this.element.querySelector('.film-details__close-btn');

  #getWatchlistElement = () => this.element.querySelector('.film-details__control-button--watchlist');
  #getWatchedElement = () => this.element.querySelector('.film-details__control-button--watched');
  #getFavoriteElement = () => this.element.querySelector('.film-details__control-button--favorite');

}
