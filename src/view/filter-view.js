import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = ({type, title, isChecked, isDisabled}) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${type}">${title}</label>
  </div>
`;

const createFilterTemplate = (filters) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map(createFilterItemTemplate).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FilterView extends AbstractView {
  #filters;
  #handleFilterTypeChange;

  constructor({filters, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('trip-filters__filter-input')) {
      return;
    }

    this.#handleFilterTypeChange?.(evt.target.value);
  };
}
