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

  setSortingClickHandler = (callback) => {
    this._callback.sortingClick = callback;
    this.element.addEventListener('click', this.#sortingClickHandler);
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

  // на элементе сортировки случился клик
  #sortingClickHandler = (evt) => {
    if (evt.target.tagName !== 'A' || !evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingClick(evt.target.dataset.sortType);
  };
}
