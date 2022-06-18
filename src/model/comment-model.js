import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#filmsApiService.getComments(filmId);
      this.comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.comments = null;
    }

    const filmComments = this.comments ? { filmId: filmId, comments: [...this.comments] } : null;

    this._notify('GET_FILM_COMMENTS', filmComments);
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      text: comment.comment,
      emojiName: comment.emotion,
    };

    // Ненужные ключи мы удаляем
    delete adaptedComment['comment'];
    delete adaptedComment['emotion'];

    return adaptedComment;
  };

  set comments(comments) {
    this.#comments = comments;
  }

  get comments() {
    return this.#comments;
  }

  addComment = (addedComment) => {
    addedComment.id = this.comments.length;

    this.comments = [
      ...this.comments,
      addedComment,
    ];

    this._notify('ADD_COMMENT', addedComment);
  };

  deleteComment = (deletedComment) => {
    const ndx = this.comments.findIndex((comment) => comment.id === deletedComment.id);

    if (ndx === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.comments = [
      ...this.comments.slice(0, ndx),
      ...this.comments.slice(ndx + 1),
    ];

    this._notify('DELETE_COMMENT', deletedComment);
  };
}
