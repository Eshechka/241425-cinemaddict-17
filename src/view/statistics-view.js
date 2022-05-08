import { createElement } from '../render.js';

const createTemplate = () => `
<p>130 291 movies inside</p>
`;

export default class StatisticsView {
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
