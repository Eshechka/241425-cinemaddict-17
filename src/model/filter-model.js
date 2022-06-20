import Observable from '../framework/observable.js';
import { FilterType, UpdateType } from '../helpers/common.js';


export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  updateFilter = (updatedFilter) => {
    this.#filter = updatedFilter;
    this._notify(UpdateType.UPDATE_FILTER, updatedFilter);
  };
}
