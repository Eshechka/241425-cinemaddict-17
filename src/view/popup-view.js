import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createTemplateCommentList = ({ emojiSrc, text, author, date }) => `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${emojiSrc}"  width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD hh:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
`;

const insertEmojiImg = (imgSrc) => {
  if (!imgSrc) {
    return '';
  }

  return `<img src="${imgSrc}" width="100%" height="100%" alt="clicked emoji"/>`;
};

const createTemplateNewComment = (commentAmount, clickedEmoji, showedEmojiImgSrc, comment) => `
<section class="film-details__comments-wrap">
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentAmount}</span></h3>


<div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">
  ${insertEmojiImg(showedEmojiImgSrc)}
  </div>

  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
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

const createTemplate = ({ title = '', rating = '', duration = '', genre = [], imgSrc, description = '', titleOriginal = '', director = '', writers = '', actors = [], release = {}, userDetails = {}, comments = [], clickedEmoji = null, showedEmojiImgSrc = null, comment = '' }) => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${imgSrc}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${titleOriginal}</p>
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
              <td class="film-details__cell">${writers}</td>
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
        <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.already_watched ? 'film-details__control-button--active' : ''} " id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''} " id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">

    <ul class="film-details__comments-list">
      ${comments.map(createTemplateCommentList).join('')}
    </ul>

    ${createTemplateNewComment(comments.length, clickedEmoji, showedEmojiImgSrc, comment)}
    </div>
  </form>
</section>
`;

export default class PopupView extends AbstractStatefulView {
  static parseFilmToState = (film) => ({
    ...film,
    comment: '',
    clickedEmoji: null,
    showedEmojiImgSrc: null,
    isCommentFocused: false,
    scrollPos: 0,
  });

  // static parseStateToFilm = (state) => {

  //   const newComment = {
  //     id: state.comments.length,
  //     filmId: state.id,
  //     text: state.comment,
  //     emojiSrc: state.showedEmojiImgSrc,
  //     author: 'me',
  //     day: dayjs().format('YYYY/MM/DD H:mm'),
  //   };
  //   const newFilmComments = state.comments.push(newComment);

  //   const film = { ...state, comments: newFilmComments };

  //   delete film.comment;
  //   delete film.clickedEmoji;
  //   delete film.showedEmojiImgSrc;
  //   delete film.isCommentFocused;
  //   delete film.scrollPos;

  //   return film;
  // };

  constructor(film = {}) {
    super();
    this._state = PopupView.parseFilmToState(film);

    this.#setInnerHandlers();
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

    this.#setInnerHandlers();
    this.setCloseElementClickHandler(this._callback.clickCloseElement);
    this.setToggleControlHandler(this._callback.toggleControl);
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
    this.#getWatchlistElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'watchlist'));
    this.#getWatchedElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'already_watched'));
    this.#getFavoriteElement().addEventListener('click', (e) => this.#clickToggleControlHandler(e, 'favorite'));
  };

  #clickToggleControlHandler = (e, type) => {
    e.preventDefault();
    this._callback.toggleControl(e, type);

    this.#setScrollPage(this._state.scrollPos);

    const userDetailsState = { ...this._state.userDetails };
    userDetailsState[type] = !userDetailsState[type];
    this.updateElement({
      userDetails: userDetailsState,
    });
  };

  #clickEmojiHandler = (e) => {
    e.preventDefault();

    let clickedEmojiElem = e.target.classList.contains('film-details__emoji-label') ? e.target.querySelector('img') : null;
    if (!clickedEmojiElem && e.target.parentNode.classList.contains('film-details__emoji-label')) {
      clickedEmojiElem = e.target;
    }

    if (clickedEmojiElem) {
      const clickedEmoji = clickedEmojiElem.parentNode.getAttribute('for');

      // const newFilm = PopupView.parseStateToFilm(this._state);

      this.updateElement({
        clickedEmoji: clickedEmoji,
        showedEmojiImgSrc: clickedEmojiElem.getAttribute('src'),
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


  #getCloseElement = () => this.element.querySelector('.film-details__close-btn');

  #getWatchlistElement = () => this.element.querySelector('.film-details__control-button--watchlist');
  #getWatchedElement = () => this.element.querySelector('.film-details__control-button--watched');
  #getFavoriteElement = () => this.element.querySelector('.film-details__control-button--favorite');

  #getEmojiListElement = () => this.element.querySelector('.film-details__emoji-list');
  #getInputCommentElement = () => this.element.querySelector('.film-details__comment-input');

}
