import { createElement } from '../render.js';

const createTemplate = () => `
<section class="films"></section>
`;

export default class FilmsView {
  #element = null;

  getElement() {
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
