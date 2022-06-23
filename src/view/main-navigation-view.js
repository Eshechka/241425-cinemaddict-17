import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../helpers/common.js';

const createFilterItemTemplate = (filter, count = 0, text = '', currentFilter = FilterType.ALL) =>
  `<a href="#${filter}" class="main-navigation__item main-navigation__item--${filter} ${currentFilter === filter ? 'main-navigation__item--active' : ''}">
      ${text}
      ${filter === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}
    </a>
  `;

const createTemplate = (filterFilms, currentFilter) => {

  const filterItemsTemplate = Object.entries(filterFilms)
    .map(([filter, filterData]) => createFilterItemTemplate(filter, filterData.count, filterData.text, currentFilter))
    .join('');

  return `
    <nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>
  `;
};

export default class MainNavigationView extends AbstractView {
  #filterFilms = null;
  #currentFilter = null;

  constructor(filterFilms = {}, currentFilter = FilterType.ALL) {
    super();
    this.#filterFilms = filterFilms;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createTemplate(this.#filterFilms, this.#currentFilter);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.#getAllFilterElement().addEventListener('click', (e) => this.#clickHandler(e, FilterType.ALL));
    this.#getWatchlistFilterElement().addEventListener('click', (e) => this.#clickHandler(e, FilterType.WATCHLIST));
    this.#getHistoryFilterElement().addEventListener('click', (e) => this.#clickHandler(e, FilterType.HISTORY));
    this.#getFavoritesFilterElement().addEventListener('click', (e) => this.#clickHandler(e, FilterType.FAVORITE));
  };

  #getAllFilterElement = () => this.element.querySelector('.main-navigation__item--all');
  #getWatchlistFilterElement = () => this.element.querySelector('.main-navigation__item--watchlist');
  #getHistoryFilterElement = () => this.element.querySelector('.main-navigation__item--alreadyWatched');
  #getFavoritesFilterElement = () => this.element.querySelector('.main-navigation__item--favorite');

  #clickHandler = (e, type) => {
    e.preventDefault();
    this._callback.click(e, type);
  };
}
