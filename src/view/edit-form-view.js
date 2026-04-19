import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const TYPE_TO_ICON = {
  taxi: 'taxi',
  bus: 'bus',
  train: 'train',
  ship: 'ship',
  drive: 'drive',
  flight: 'flight',
  'check-in': 'check-in',
  sightseeing: 'sightseeing',
  restaurant: 'restaurant',
};

const EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';
const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

const formatEditDateTime = (isoString) => (isoString ? dayjs(isoString).format(EDIT_DATE_FORMAT) : '');

const createPhotosTemplate = (pictures = []) => {
  if (!pictures.length) {
    return '';
  }

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((p) => `<img class="event__photo" src="${p.src}" alt="${p.description}">`).join('')}
      </div>
    </div>
  `;
};

const createOfferSelectorTemplate = (offer, isChecked, pointId) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offer.id}-${pointId}"
      type="checkbox"
      name="event-offer-${offer.id}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="event-offer-${offer.id}-${pointId}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
`;

const createTypeItemTemplate = (type, currentType, pointId) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-${pointId}"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === currentType ? 'checked' : ''}
    >
    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${pointId}">
      ${type[0].toUpperCase()}${type.slice(1)}
    </label>
  </div>
`;

const createEditFormTemplate = ({state, destinations, offersByType}) => {
  const icon = TYPE_TO_ICON[state.type] ?? 'flight';

  const destination = destinations.find((d) => d.id === state.destination) ?? null;

  const offersBlock = offersByType.find((o) => o.type === state.type);
  const availableOffers = offersBlock ? offersBlock.offers : [];

  const offersTemplate = availableOffers.length
    ? availableOffers
      .map((offer) =>
        createOfferSelectorTemplate(
          offer,
          state.offers.includes(offer.id),
          state.id
        )
      )
      .join('')
    : '<p class="event__no-offers">No offers</p>';

  const destinationName = destination ? destination.name : '';

  const startValue = formatEditDateTime(state.dateFrom);
  const endValue = formatEditDateTime(state.dateTo);

  return `
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post" autocomplete="off">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-${state.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}.png" alt="Event type icon">
        </label>

        <input class="event__type-toggle visually-hidden" id="event-type-toggle-${state.id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${Object.keys(TYPE_TO_ICON).map((type) => createTypeItemTemplate(type, state.type, state.id)).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${state.id}">
          ${state.type[0].toUpperCase()}${state.type.slice(1)}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${state.id}"
          type="text"
          name="event-destination"
          value="${destinationName}"
          list="destination-list-${state.id}"
        >
        <datalist id="destination-list-${state.id}">
          ${destinations.map((d) => `<option value="${d.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${state.id}">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-${state.id}"
          type="text"
          name="event-start-time"
          value="${startValue}"
        >
        —
        <label class="visually-hidden" for="event-end-time-${state.id}">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-${state.id}"
          type="text"
          name="event-end-time"
          value="${endValue}"
        >
      </div>

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${state.id}">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input event__input--price" id="event-price-${state.id}" type="text" name="event-price" value="${state.basePrice}">
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
        <p class="event__destination-description">${destination ? destination.description : ''}</p>
        ${destination ? createPhotosTemplate(destination.pictures) : ''}
      </section>
    </section>
  </form>
</li>
  `;
};

export default class EditFormView extends AbstractStatefulView {
  #destinations = [];
  #offersByType = [];

  #handleFormSubmit = null;
  #handleRollupClick = null;

  #startDatepicker = null;
  #endDatepicker = null;

  constructor({point, destinations, offersByType, onFormSubmit, onRollupClick}) {
    super();
    this._setState(EditFormView.parsePointToState(point));

    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate({
      state: this._state,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
    });
  }

  _restoreHandlers() {
    this.element.querySelector('form')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#rollupClickHandler);

    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);

    this.#setDatepickers();
  }

  #destroyDatepickers() {
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  #setDatepickers() {
    this.#destroyDatepickers();

    const startInput = this.element.querySelector(`#event-start-time-${this._state.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${this._state.id}`);

    if (!startInput || !endInput) {
      return;
    }

    this.#startDatepicker = flatpickr(startInput, {
      enableTime: true,
      dateFormat: FLATPICKR_DATE_FORMAT,
      'time_24hr': true,
      defaultDate: this._state.dateFrom,
      maxDate: this._state.dateTo,
      onChange: this.#startDateChangeHandler,
    });

    this.#endDatepicker = flatpickr(endInput, {
      enableTime: true,
      dateFormat: FLATPICKR_DATE_FORMAT,
      'time_24hr': true,
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: this.#endDateChangeHandler,
    });
  }

  #startDateChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }
    this._setState({dateFrom: userDate.toISOString()});
    this.#endDatepicker?.set('minDate', userDate);
  };

  #endDateChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }
    this._setState({dateTo: userDate.toISOString()});
    this.#startDatepicker?.set('maxDate', userDate);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.(evt);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;

    this.#destroyDatepickers();

    this.updateElement({
      type: newType,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const value = evt.target.value;
    const found = this.#destinations.find((d) => d.name === value);

    if (!found) {
      return;
    }

    this.#destroyDatepickers();

    this.updateElement({
      destination: found.id,
    });
  };

  #offersChangeHandler = (evt) => {
    const target = evt.target;
    if (!target || target.type !== 'checkbox') {
      return;
    }

    const idAttr = target.id || '';
    const match = idAttr.match(/^event-offer-(.+)-.+$/);
    if (!match) {
      return;
    }
    const offerId = match[1];

    const nextOffers = target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => id !== offerId);

    this._setState({offers: nextOffers});
  };

  static parsePointToState(point) {
    return {...point};
  }
}
