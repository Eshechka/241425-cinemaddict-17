import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = ({ title = '', rating = '', year = '', duration = '', genre = '', imgSrc = '', description = '', comments = [] }) => `
<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${imgSrc}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
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

  #clickHandler = (e) => {
    e.preventDefault();
    this._callback.click();
  };
}
