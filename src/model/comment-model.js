import { generateComments } from '../mock/comment.js';
import { FILMS_AMOUNT } from '../model/film-model.js';

export default class CommentModel {
  #comments = generateComments(FILMS_AMOUNT);

  get comments() {
    return this.#comments;
  }
}
