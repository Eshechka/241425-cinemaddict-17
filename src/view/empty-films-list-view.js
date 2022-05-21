import { createElement } from '../render.js';

const createTemplate = (title) => `
<section class="films-list">
      <h2 class="films-list__title">${title}</h2>
</section>
`;

export default class EmptyFilmsListView {
  #element = null;
  #title = null;

  constructor(title = 'There are no movies in our database') {
    this.#title = title;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTemplate(this.#title);
  }

  removeElement() {
    this.#element = null;
  }
}
