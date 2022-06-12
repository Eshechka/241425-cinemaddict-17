import Observable from '../framework/observable.js';


export default class FilterModel extends Observable {
  #filter = 'all';

  get filter() {
    return this.#filter;
  }

  updateFilter = (updatedFilter) => {
    this.#filter = updatedFilter;
    this._notify('UPDATE_FILTER', updatedFilter);
  };
}
