import Observable from '../framework/observable.js';

import { generateComments } from '../mock/comment.js';
import { FILMS_AMOUNT } from '../model/film-model.js';

export default class CommentModel extends Observable {
  #comments = generateComments(FILMS_AMOUNT);

  set comments(comments) {
    this.#comments = comments;
  }

  get comments() {
    return this.#comments;
  }
}
