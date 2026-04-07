import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = ({type, title, isChecked, isDisabled}) => `
  <div class="trip-sort__item trip-sort__item--${type}">
    <input
      id="sort-${type}"
      class="trip-sort__input visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${type}"
      data-sort-type="${type}"
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
  #handleSortTypeChange;

  constructor({sortItems, onSortTypeChange}) {
    super();
    this.#sortItems = sortItems;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortClickHandler);
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }

  #sortClickHandler = (evt) => {
    const input = evt.target.closest('.trip-sort__btn')
      ? document.getElementById(evt.target.getAttribute('for'))
      : evt.target.closest('.trip-sort__input');

    if (!input || input.disabled) {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(input.dataset.sortType);
  };
}
