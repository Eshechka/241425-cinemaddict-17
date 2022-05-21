import { createElement } from '../render.js';

const createTemplate = (title, isVisuallyHidden, isExtra) => `
<section class="films-list ${isExtra ? ' films-list--extra' : ''}">
  <h2 class="films-list__title ${isVisuallyHidden ? ' visually-hidden' : ''}">${title}</h2>
  <div class="films-list__container"></div>
</section>
`;

export default class FilmsListView {
  #element = null;
  #title = null;
  #isVisuallyHidden = null;
  #isExtra = null;

  constructor(title = '', isVisuallyHidden = false, isExtra = false) {
    this.#title = title;
    this.#isVisuallyHidden = isVisuallyHidden;
    this.#isExtra = isExtra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTemplate(this.#title, this.#isVisuallyHidden, this.#isExtra);
  }

  removeElement() {
    this.#element = null;
  }
}
