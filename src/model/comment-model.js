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

  addComment = (addedComment) => {
    addedComment.id = this.comments.length;

    this.#comments = [
      ...this.#comments,
      addedComment,
    ];

    this._notify('ADD_COMMENT', addedComment);
  };

  deleteComment = (deletedComment) => {
    const ndx = this.#comments.findIndex((comment) => comment.id === deletedComment.id);

    if (ndx === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, ndx),
      ...this.#comments.slice(ndx + 1),
    ];

    this._notify('DELETE_COMMENT', deletedComment);
  };
}
