import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FilterType } from '../helpers/common.js';


const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

const getEmojiImgByName = (emojiName) => {
  if (!emojiName) {
    return '';
  }

  return `./images/emoji/${emojiName}.png`;
};
const insertEmojiImg = (imgSrc) => {
  if (!imgSrc) {
    return '';
  }

  return `<img src="${imgSrc}" width="100%" height="100%" alt="clicked emoji"/>`;
};


const createTemplateCommentList = ({ id, emojiName, text, author, date }, isCommentDeleting) => `
  <li class="film-details__comment" data-id=${id}>
    <span class="film-details__comment-emoji">
      <img src="${getEmojiImgByName(emojiName)}"  width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>

        <button ${isCommentDeleting ? 'disabled' : ''} class="film-details__comment-delete">${isCommentDeleting ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>
`;

const createTemplateNewComment = (commentAmount, clickedEmoji, showedEmojiName, comment, isFormDisabled) => `
<section class="film-details__comments-wrap">
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentAmount}</span></h3>


<div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">
    ${insertEmojiImg(getEmojiImgByName(showedEmojiName))}
  </div>

  <label class="film-details__comment-label">
    <textarea ${isFormDisabled ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
  </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
    id="emoji-smile" ${clickedEmoji === 'emoji-smile' ? 'checked' : ''}
    value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
    id="emoji-sleeping" ${clickedEmoji === 'emoji-sleeping' ? 'checked' : ''}
    value="sleeping">
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
    id="emoji-puke"  ${clickedEmoji === 'emoji-puke' ? 'checked' : ''}
    value="puke">
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
    id="emoji-angry" ${clickedEmoji === 'emoji-angry' ? 'checked' : ''}
    value="angry">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
    </label>
  </div>
</div>
</section>
`;

const createTemplate = ({ filmInfo: { title = '', rating = '', duration = '', genre = [], imgSrc, description = '', alternativeTitle = '', ageRating = '', director = '', writers = [], actors = [], release = {} }, userDetails = {}, comments = null, clickedEmoji = null, showedEmojiName = null, comment = '', isFormDisabled = false, commentDeletingId = null }) => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${imgSrc}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              ${writers.map((writer) => `
              <td class="film-details__cell">${writer}</td>
              `).join('')}
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              ${actors.map((actor) => `
                <td class="film-details__cell">${actor}</td>
              `).join('')}
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(release.date).format('D MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${dayjs().set('hour', Math.floor(duration / 60)).set('minute', duration % 60).format('h[h] mm[m]')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.release_country ? release.release_country : ''}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
              ${genre.map((genr) => `
                <span class="film-details__genre">${genr}</span>
              `).join('')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? 'film-details__control-button--active' : ''} " id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''} " id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''} " id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">

    ${comments ? `<ul class="film-details__comments-list">
          ${comments.map((cmt) => createTemplateCommentList(cmt, commentDeletingId && cmt.id === commentDeletingId)).join('')}
          ${createTemplateNewComment(comments.length, clickedEmoji, showedEmojiName, comment, isFormDisabled)}
      </ul>` : '<h3 class="film-details__comments-title">Не удалось загрузить комменатрии</h3>'}

    </div>
  </form>
</section>
  `;

export default class PopupView extends AbstractStatefulView {

  static initState = (film) => ({
    ...film,
    comment: '',
    clickedEmoji: null,
    showedEmojiName: null,
    isCommentFocused: false,
    scrollPos: 0,

    isFormDisabled: false,
    commentDeletingId: null,
  });

  constructor(film = {}) {
    super();
    this._state = PopupView.initState(film);

    if (this._state.comments) {
      this.#setInnerHandlers();
    }
  }

  get template() {
    return createTemplate(this._state);
  }

  #setInnerHandlers = () => {
    this.#getEmojiListElement().addEventListener('click', this.#clickEmojiHandler);
    this.#getInputCommentElement().addEventListener('input', this.#inputCommentHandler);
  };

  _restoreHandlers = () => {
    this.#setScrollPage(this._state.scrollPos);
    this.#setCommentFocus(this._state.isCommentFocused);

    if (this._state.comments) {
      this.#setInnerHandlers();
      this.setClickDeleteHandler(this._callback.clickDelete);
    }
    this.setCloseElementClickHandler(this._callback.clickCloseElement);
    this.setToggleControlHandler(this._callback.toggleControl);
    this.setSubmitAddCommentFormHandler(this._callback.submitAddCommentForm);
  };

  setCloseElementClickHandler = (callback) => {
    this._callback.clickCloseElement = callback;
    this.#getCloseElement().addEventListener('click', this.#clickCloseElementHandler);
  };

  #clickCloseElementHandler = (e) => {
    e.preventDefault();
    this._callback.clickCloseElement();
  };

  setToggleControlHandler = (callback) => {
    this._callback.toggleControl = callback;
    this.#getWatchlistElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.WATCHLIST));
    this.#getWatchedElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.HISTORY));
    this.#getFavoriteElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, FilterType.FAVORITE));
  };

  #clickToggleControlHandler = (e, type) => {
    e.preventDefault();
    this._callback.toggleControl(e, type);

    this.#setScrollPage(this._state.scrollPos);
  };

  setClickDeleteHandler = (callback) => {
    this._callback.clickDelete = callback;
    if (this._state.comments) {
      this.#getCommentListElement().addEventListener('click', this.#clickDeleteHandler);
    }
  };

  #clickDeleteHandler = (e) => {
    e.preventDefault();

    const commentElement = e.target.dataset.id ? e.target : e.target.closest('[data-id]');
    if (commentElement) {
      const changedCommentId = +commentElement.dataset.id;

      this.#setScrollPage(this._state.scrollPos);

      const deletedComment = [...this._state.comments].find((comment) => +comment.id === changedCommentId);
      this._callback.clickDelete(e, { filmId: this._state.id, ...deletedComment });

      this.updateElement({
        commentDeletingId: deletedComment.id,
      });
    }

  };


  setSubmitAddCommentFormHandler = (callback) => {
    this._callback.submitAddCommentForm = callback;
    document.addEventListener('keydown', this.submitAddCommentFormHandler);
  };

  #submitAddCommentFormHandler = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {

      e.preventDefault();

      if (this._state.comment && this._state.showedEmojiName) {// если и эмоция и текст предоставлены

        this.#setScrollPage(this._state.scrollPos);

        const newComment = {
          filmId: this._state.id,
          text: this._state.comment,
          emojiName: this._state.showedEmojiName,
        };

        this._callback.submitAddCommentForm(e, newComment);

        this.updateElement({
          isFormDisabled: !this._state.isFormDisabled,
        });
      }
    }
  };

  updateAfterUpdateFilm = (userDetails) => {
    this.updateElement({
      userDetails: { ...userDetails },
    });
  };

  updateAfterAddComment = (newComments) => {
    this.updateElement({
      comments: newComments,
      comment: '',
      clickedEmoji: null,
      showedEmojiName: null,
      isCommentFocused: false,
      scrollPos: this.element.scrollTop,
      isFormDisabled: !this._state.isFormDisabled,
    });
  };

  updateAfterFailureDeleteComment = () => {
    this.updateElement({
      commentDeletingId: null,
    });
  };

  updateAfterDeleteComment = (comments) => {
    this.updateElement({
      'comments': [...comments],
    });
  };


  #clickEmojiHandler = (e) => {
    e.preventDefault();

    if (this._state.isFormDisabled) {
      return;
    }

    let clickedEmojiElem = e.target.classList.contains('film-details__emoji-label') ? e.target.querySelector('img') : null;
    if (!clickedEmojiElem && e.target.parentNode.classList.contains('film-details__emoji-label')) {
      clickedEmojiElem = e.target;
    }

    // clickedEmojiElem - img
    if (clickedEmojiElem) {
      const clickedEmoji = clickedEmojiElem.parentNode.getAttribute('for');

      this.updateElement({
        clickedEmoji: clickedEmoji,
        showedEmojiName: clickedEmoji.slice(6),
        scrollPos: this.element.scrollTop,
      });
    }
  };

  #inputCommentHandler = (e) => {
    this.updateElement({
      comment: e.target.value,
      isCommentFocused: true,
      scrollPos: this.element.scrollTop,
    });
  };

  #setCommentFocus = (isFocused) => {
    if (!isFocused) {
      return;
    }
    const commentElement = this.#getInputCommentElement();
    commentElement.focus();
    commentElement.selectionStart = commentElement.value.length;
  };

  #setScrollPage = (scrollPos) => {
    if (!scrollPos) {
      return;
    }

    this.element.scrollTo({ top: +scrollPos });
  };

  shakeElement(element) {
    element.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => { element.classList.remove(SHAKE_CLASS_NAME); }, SHAKE_ANIMATION_TIMEOUT);
  }

  #getCloseElement = () => this.element.querySelector('.film-details__close-btn');

  #getWatchlistElement = () => this.element.querySelector('.film-details__control-button--watchlist');
  #getWatchedElement = () => this.element.querySelector('.film-details__control-button--watched');
  #getFavoriteElement = () => this.element.querySelector('.film-details__control-button--favorite');

  #getEmojiListElement = () => this.element.querySelector('.film-details__emoji-list');
  #getInputCommentElement = () => this.element.querySelector('.film-details__comment-input');

  #getCommentListElement = () => this.element.querySelector('.film-details__comments-list');
  getCommentElement = (commentId) => this.element.querySelector(`[data-id='${commentId}']`);
  getNewCommentElement = () => this.element.querySelector('.film-details__new-comment');
  getControlsElement = () => this.element.querySelector('.film-details__controls');

}
