import { createElement, render } from '../render.js';
import CommentView from './comment-view.js';

const createTemplate = () => `
<ul class="film-details__comments-list"></ul>
`;

export default class CommentListView {
  #element = null;

  constructor(comments = []) {
    this.comments = comments;
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
      if (this.comments.length > 0) {
        this.comments.forEach((comment) => render(new CommentView(comment), this.#element));
      }
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
