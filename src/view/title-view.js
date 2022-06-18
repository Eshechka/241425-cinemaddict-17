import AbstractView from '../framework/view/abstract-view.js';

const checkTitle = (num) => {
  switch (true) {
    case (num > 20):
      return 'movie buff';
    case (num > 10):
      return 'fan';
    case (num > 0):
      return 'novice';
  }
};

const createTemplate = (amountWatchedFilms) => `
<section class="header__profile profile">
${amountWatchedFilms ?
    `<p class="profile__rating"> ${checkTitle(amountWatchedFilms)} </p >
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">` : ''}
</section >
`;

export default class TitleView extends AbstractView {
  #amountWatchedFilms = null;

  constructor(amountWatchedFilms = 0) {
    super();
    this.#amountWatchedFilms = amountWatchedFilms;
  }

  get template() {
    return createTemplate(this.#amountWatchedFilms);
  }

}
