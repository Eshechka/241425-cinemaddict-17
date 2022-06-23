import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;

export default class ShowMoreBtnView extends AbstractView {

  get template() {
    return createTemplate();
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
