import { createElement, render } from '../render.js';
import FilmsListView from './films-list-view.js';
import cardsModel from '../model/cards-model.js';

const createTemplate = () => `
<section class="films"></section>
`;

export default class FilmsView {
  #element = null;

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);

      render(new FilmsListView('All movies. Upcoming', true, false, cardsModel, 5, true), this.#element);
      render(new FilmsListView('Top rated', false, true, cardsModel), this.#element);
      render(new FilmsListView('Most commented', false, true, cardsModel), this.#element);
    }

    return this.#element;
  }

  get template() {
    return createTemplate(this.title, this.isVisuallyHidden, this.isExtra, this.cards);
  }

  removeElement() {
    this.#element = null;
  }
}
