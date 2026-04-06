import AbstractView from '../framework/view/abstract-view.js';

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

const formatMonthDay = (isoString) => {
  const date = new Date(isoString);
  const month = date.toLocaleString('en-US', {month: 'short'}).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  return `${month} ${day}`;
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const getDuration = (fromIso, toIso) => {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const diff = to - from;
  const minutes = Math.floor(diff / 60000);

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}M`;
  }

  return mins === 0 ? `${hours}H` : `${hours}H ${mins}M`;
};

const createPointTemplate = ({point, destination, offers}) => {
  const icon = TYPE_TO_ICON[point.type] ?? 'flight';

  const selectedOffers = offers
    .filter((offer) => point.offers.includes(offer.id))
    .map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `)
    .join('');

  const offersTemplate = selectedOffers
    ? `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">${selectedOffers}</ul>`
    : '';

  const day = formatMonthDay(point.dateFrom);
  const startTime = formatTime(point.dateFrom);
  const endTime = formatTime(point.dateTo);
  const duration = getDuration(point.dateFrom, point.dateTo);

  const title = `${point.type[0].toUpperCase()}${point.type.slice(1)} ${destination.name}`;

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${point.dateFrom}">${day}</time>

        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
        </div>

        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.dateFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.dateTo}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>

        ${offersTemplate}

        <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class PointView extends AbstractView {
  #point;
  #destination;
  #offers;

  #handleEditClick;
  #handleFavoriteClick;

  constructor({point, destination, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleEditClick?.();
    });

    this.element.querySelector('.event__favorite-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.#handleFavoriteClick?.();
    });
  }

  get template() {
    return createPointTemplate({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
    });
  }
}
