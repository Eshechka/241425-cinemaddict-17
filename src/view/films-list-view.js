import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (title, isVisuallyHidden, isExtra) => `
<section class="films-list ${isExtra ? ' films-list--extra' : ''}">
  <h2 class="films-list__title ${isVisuallyHidden ? ' visually-hidden' : ''}">${title}</h2>
  <div class="films-list__container"></div>
</section>
`;

export default class FilmsListView extends AbstractView {
  #title = null;
  #isVisuallyHidden = null;
  #isExtra = null;

  constructor(title = '', isVisuallyHidden = false, isExtra = false) {
    super();
    this.#title = title;
    this.#isVisuallyHidden = isVisuallyHidden;
    this.#isExtra = isExtra;
  }

  get template() {
    return createTemplate(this.#title, this.#isVisuallyHidden, this.#isExtra);
  }

  getFilmsListContainer() {
    return this.element.querySelector('.films-list__container');
  }

}
