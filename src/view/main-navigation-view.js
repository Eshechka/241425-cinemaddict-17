import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeStr } from '../helpers/common.js';

const createFilterItemTemplate = (filter, count = 0) => {
  if (filter !== 'all') {
    return `<a href="#${filter}" class="main-navigation__item">${capitalizeStr(filter)}<span class="main-navigation__item-count">${count}</span></a>`;
  }
  return `<a href="#${filter}" class="main-navigation__item main-navigation__item--active">All movies</a>`;
};

const createTemplate = (filtersFilms) => {

  const filterItemsTemplate = Object.entries(filtersFilms)
    .map(([filter, count]) => createFilterItemTemplate(filter, count))
    .join('');

  return `
    <nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>
  `;
};

export default class MainNavigationView extends AbstractView {
  #filtersFilms = null;

  constructor(filtersFilms = {}) {
    super();
    this.#filtersFilms = filtersFilms;
  }

  get template() {
    return createTemplate(this.#filtersFilms);
  }

}
