import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (amountFilms) => `
<p>${amountFilms} movies inside</p>
`;

export default class StatisticsView extends AbstractView {
  #amountFilms = null;

  constructor(amountFilms = 0) {
    super();
    this.#amountFilms = amountFilms;
  }

  get template() {
    return createTemplate(this.#amountFilms);
  }

}
