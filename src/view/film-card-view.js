import dayjs from 'dayjs';

import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../helpers/common.js';


const createTemplate = ({ filmInfo: { title = '', rating = '', release = {}, duration = '', genres = [], imgSrc = '', description = '' }, userDetails = {}, comments = [] }) => `
<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(release.date).year()}</span>
      <span class="film-card__duration">${dayjs().set('hour', Math.floor(duration / 60)).set('minute', duration % 60).format('h[h] mm[m]')}</span>
      <span class="film-card__genre">${genres.map((genre) => genre).join(' ')}</span>
    </p>
    <img src="${imgSrc}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>
`;

export default class FilmCardView extends AbstractView {
  #card = null;

  constructor(card = {}) {
    super();
    this.#card = card;
  }

  get template() {
    return createTemplate(this.#card);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  setToggleControlHandler = (callback) => {
    this._callback.toggleControl = callback;
    this.#getWatchlistElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.WATCHLIST));
    this.#getWatchedElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.HISTORY));
    this.#getFavoriteElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.FAVORITE));
  };

  #getWatchlistElement = () => this.element.querySelector('.film-card__controls-item--add-to-watchlist');
  #getWatchedElement = () => this.element.querySelector('.film-card__controls-item--mark-as-watched');
  #getFavoriteElement = () => this.element.querySelector('.film-card__controls-item--favorite');
  #getControlsClass = () => 'film-card__controls-item';

  #clickHandler = (e) => {
    e.preventDefault();
    if (!e.target.classList.contains(this.#getControlsClass())) {
      this._callback.click();
    }
  };

  #clickToggleControlHandler = (e, type) => {
    e.preventDefault();
    this._callback.toggleControl(e, type);
  };
}
