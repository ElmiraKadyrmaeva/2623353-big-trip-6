import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = ({type, title, isChecked, isDisabled}) => `
  <div class="trip-sort__item trip-sort__item--${type}">
    <input
      id="sort-${type}"
      class="trip-sort__input visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${type}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-sort__btn" for="sort-${type}">${title}</label>
  </div>
`;

const createSortTemplate = (sortItems) => `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${sortItems.map(createSortItemTemplate).join('')}
  </form>
`;

export default class SortView extends AbstractView {
  #sortItems;

  constructor({sortItems}) {
    super();
    this.#sortItems = sortItems;
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }
}
