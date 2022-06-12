import { render, replace } from '../framework/render.js';

import MainNavigationView from '../view/main-navigation-view.js';


export default class FiltersPresenter {
  #filterModel = null;
  #filmModel = null;
  #mainNavigationContainer = null;
  #mainNavigationComponent = null;

  constructor(mainNavigationContainer, filmModel, filterModel) {
    this.#mainNavigationContainer = mainNavigationContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;

    this.#mainNavigationComponent = new MainNavigationView(this.filters);

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    // рендерим общий контейнер для всех списков фильмов
    render(this.#mainNavigationComponent, this.#mainNavigationContainer);

    this.#mainNavigationComponent.setClickHandler((_, type) => {
      // вызываем метод, который вызовет метод модели filtersModel (с обновленными данными)
      this.#handleViewAction(type);
    });
  };

  get filters() {
    const films = this.#filmModel.films;

    return {
      'all': { text: 'All movies', count: films.length },
      'watchlist': { text: 'Watchlist', count: this.#countFilter('watchlist', films) },
      'already_watched': { text: 'History', count: this.#countFilter('already_watched', films) },
      'favorite': { text: 'Favorites', count: this.#countFilter('favorite', films) },
    };
  }

  #countFilter = (type = '', films = []) => {
    if (!type) {
      return 0;
    }
    return films.filter((film) => film.userDetails[type]).length;
  };

  #handleViewAction = (updatedFilter) => {
    this.#filterModel.updateFilter(updatedFilter);
  };

  #handleModelEvent = (updateType, data) => {
    // запоминаем предыдущий cardComponent
    const prevMainNavigationComponent = this.#mainNavigationComponent;

    switch (updateType) {
      case 'UPDATE_FILTER':
        this.#mainNavigationComponent = new MainNavigationView(this.filters, data);
        break;
      case 'UPDATE_FILM':
        this.#mainNavigationComponent = new MainNavigationView(this.filters);
        break;
    }

    // заменяем разметку
    replace(this.#mainNavigationComponent, prevMainNavigationComponent);
    this.#mainNavigationComponent.setClickHandler((_, type) => {
      // вызываем метод, который вызовет метод модели filtersModel (с обновленными данными)
      this.#handleViewAction(type);
    });
  };
}
