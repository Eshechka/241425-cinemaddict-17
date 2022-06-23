import Observable from '../framework/observable.js';
import { UpdateType } from '../helpers/common.js';

export default class CommentModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async (film) => {
    try {
      const comments = await this.#filmsApiService.getComments(film.id);
      this.comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.comments = null;
    }

    const newFilm = { ...film, comments: this.comments };

    this._notify(UpdateType.GET_FILM_COMMENTS, newFilm);
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

  addComment = async (addedComment) => {
    try {
      const response = await this.#filmsApiService.addComment(addedComment);
      const data = this.#adaptToClient(response);

      const newFilmComments = [...data.comments].map(this.#adaptToClient);
      const newComment = newFilmComments[newFilmComments.length - 1];

      newComment.filmId = data.movie.id;
      this.comments = [...this.comments, newComment];

      this._notify(UpdateType.ADD_COMMENT, newComment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (deletedComment) => {
    const index = this.comments.findIndex((comment) => comment.id === deletedComment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteComment(deletedComment);
      this.comments = [
        ...this.comments.slice(0, index),
        ...this.comments.slice(index + 1),
      ];

      this._notify(UpdateType.DELETE_COMMENT, this.comments);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

}

