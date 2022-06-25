import { render, replace } from '../framework/render.js';
import { FilterType, UpdateType } from '../helpers/common.js';

import MainNavigationView from '../view/main-navigation-view.js';

export default class FiltersPresenter {
  #filterModel = null;
  #filmModel = null;

  #mainNavigationContainer = null;
  #mainNavigationComponent = null;

  #currentFilter = FilterType.ALL;

  constructor(mainNavigationContainer, filmModel, filterModel) {
    this.#mainNavigationContainer = mainNavigationContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;

    this.#mainNavigationComponent = new MainNavigationView(this.filters);

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmModel.films;
    this.#currentFilter = this.#filterModel.filter;

    return {
      'all': { text: 'All movies', count: films.length },
      'watchlist': { text: 'Watchlist', count: this.#countFilter(FilterType.WATCHLIST, films) },
      'alreadyWatched': { text: 'History', count: this.#countFilter(FilterType.HISTORY, films) },
      'favorite': { text: 'Favorites', count: this.#countFilter(FilterType.FAVORITE, films) },
    };
  }

  init = () => {
    // рендерим общий контейнер для всех списков фильмов
    render(this.#mainNavigationComponent, this.#mainNavigationContainer);

    this.#mainNavigationComponent.setClickHandler((_, type) => {
      // вызываем метод, который вызовет метод модели filtersModel (с обновленными данными)
      this.#handleViewAction(type);
    });
  };

  #countFilter = (type = '', films = []) => {
    if (!type) {
      return 0;
    }
    return films.filter((film) => film.userDetails[type]).length;
  };

  #handleViewAction = (updatedFilter) => {
    this.#filterModel.updateFilter(updatedFilter);
  };

  #handleModelEvent = (updatedType, data) => {
    // запоминаем предыдущий cardComponent
    const prevMainNavigationComponent = this.#mainNavigationComponent;

    switch (updatedType) {
      case UpdateType.INIT:
        this.#mainNavigationComponent = new MainNavigationView(this.filters);//data - none
        break;
      case UpdateType.UPDATE_FILTER:
        this.#mainNavigationComponent = new MainNavigationView(this.filters, data);//data - updatedFilter
        break;
      case UpdateType.UPDATE_FILM:
        this.#mainNavigationComponent = new MainNavigationView(this.filters, this.#currentFilter);//data - updatedFilm
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
