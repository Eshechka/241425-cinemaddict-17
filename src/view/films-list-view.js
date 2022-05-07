import { createElement, render } from '../render.js';
import FilmCardView from './film-card-view.js';
import ShowMoreBtnView from './show-more-btn-view.js';

const createTemplate = (title, isVisuallyHidden, isExtra) => `
<section class="films-list ${isExtra ? ' films-list--extra' : ''}">
  <h2 class="films-list__title ${isVisuallyHidden ? ' visually-hidden' : ''}">${title}</h2>
  <div class="films-list__container"></div>
</section>
`;

export default class FilmsListView {
  #element = null;

  constructor(title = null, isVisuallyHidden = false, isExtra = false, cards = [], cardsCount = 1, isShowMoreBtn = false) {
    this.title = title;
    this.isVisuallyHidden = isVisuallyHidden;
    this.isExtra = isExtra;
    this.cards = cards.slice(0, cardsCount);
    this.isShowMoreBtn = isShowMoreBtn;
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
      if (this.cards.length > 0) {
        const cardsContainer = this.#element.querySelector('.films-list__container');
        this.cards.forEach((card) => render(new FilmCardView(card), cardsContainer));

        if (this.isShowMoreBtn) {
          render(new ShowMoreBtnView(), this.#element);
        }
      }
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
