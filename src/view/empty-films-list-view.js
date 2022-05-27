import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (title) => `
<section class="films-list">
      <h2 class="films-list__title">${title}</h2>
</section>
`;

export default class EmptyFilmsListView extends AbstractView {
  #title = null;

  constructor(title = 'There are no movies in our database') {
    super();
    this.#title = title;
  }

  get template() {
    return createTemplate(this.#title);
  }

}
