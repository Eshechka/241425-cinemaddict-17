import { createElement } from '../render.js';

const createTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;

export default class ShowMoreBtnView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
