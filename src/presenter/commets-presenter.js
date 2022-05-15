
import { render } from '../render.js';
import { RenderPosition } from '../render.js';
import CommentListView from '../view/comments-list-view.js';
import CommentsView from '../view/comments-view.js';


export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsModel = null;
  #filmId = null;

  #comments = [];

  constructor(commentsContainer, commentsModel, filmId = null) {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#filmId = filmId;
  }

  init = () => {
    if (!this.#filmId) {
      return false;
    }

    this.#comments = [...this.#commentsModel.comments.filter((comment) => comment.filmId === this.#filmId)];

    this.#renderComments();
  };


  #renderComments = () => {

    render(new CommentsView(this.#comments.length), this.#commentsContainer);

    const CommentListElementAfter = document.querySelector('.film-details__new-comment');
    render(new CommentListView(this.#comments), CommentListElementAfter, RenderPosition.BEFOREBEGIN);

  };

}
