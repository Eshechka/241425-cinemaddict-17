import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = () => `
  <ul class="sort">
    <li>
      <a href="#" class="sort__button sort__button--active" data-sort-type="default">
        Sort by default
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="date">
        Sort by date
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="rating">
        Sort by rating
      </a>
    </li>
  </ul>
`;

export default class SortView extends AbstractView {

  get template() {
    return createTemplate();
  }

  setClickSortingHandler = (callback) => {
    this._callback.clickSorting = callback;
    this.element.addEventListener('click', this.#clickSortingHandler);
  };

  #clickSortingHandler = (e) => {

    if (e.target.tagName !== 'A' || !e.target.dataset.sortType) {
      return;
    }

    e.preventDefault();
    this._callback.clickSorting(e.target.dataset.sortType);
  };

  setActiveSortingElement = (sortType) => {
    const sortBtns = this.element.querySelectorAll('.sort__button');
    sortBtns.forEach((btn) => {
      btn.classList.remove('sort__button--active');
      if (btn.dataset.sortType === sortType) {
        btn.classList.add('sort__button--active');
      }
    });
  };
}
