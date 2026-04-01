import AbstractView from '../framework/view/abstract-view.js';

const formatEditDate = (isoString) => {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
};

const createEditFormTemplate = ({point, destination, offers}) => {
  const title = `${point.type[0].toUpperCase()}${point.type.slice(1)} ${destination.name}`;

  const startDate = formatEditDate(point.dateFrom);
  const endDate = formatEditDate(point.dateTo);

  const offersTemplate = offers.length
    ? offers.map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}-${point.id}" type="checkbox" name="event-offer-${offer.id}">
        <label class="event__offer-label" for="event-offer-${offer.id}-${point.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `).join('')
    : '<p class="event__no-offers">No offers</p>';

  return `
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-${point.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">
      </div>

      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${point.id}">${title}</label>
        <input class="event__input event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${destination.name}">
      </div>

      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
        <input class="event__input event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${startDate}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
        <input class="event__input event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${endDate}">
      </div>

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${point.id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.basePrice}">
      </div>

      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>
    </header>

    <section class="event__details">
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersTemplate}
        </div>
      </section>

      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
      </section>
    </section>
  </form>
</li>
  `;
};

export default class EditFormView extends AbstractView {
  #point;
  #destination;
  #offers;
  #handleFormSubmit;
  #handleRollupClick;

  constructor({point, destination, offers, onFormSubmit, onRollupClick} = {}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
  }

  setHandlers() {
    this.element.querySelector('form')?.addEventListener('submit', this.#handleFormSubmit);

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleRollupClick?.();
    });
  }

  get template() {
    return createEditFormTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
    });
  }
}
