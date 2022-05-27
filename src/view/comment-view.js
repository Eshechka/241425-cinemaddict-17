import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = ({ emojiSrc, text, author, day }) => `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${emojiSrc}"  width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${day}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
`;


export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment = {}) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createTemplate(this.#comment);
  }

}
