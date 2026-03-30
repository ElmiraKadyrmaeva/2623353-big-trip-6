const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Rome', 'Saint Petersburg', 'Geneva', 'Chamonix', 'Amsterdam', 'Paris', 'Berlin'];

const getRandomInteger = (min, max) => {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + getRandomInteger(-10, 10));
  date.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59), 0, 0);
  return date;
};

const toISOString = (date) => date.toISOString();

const createDestinations = (count = 5) =>
  Array.from({length: count}, (_, idx) => ({
    id: `dest-${idx + 1}`,
    name: getRandomArrayElement(CITIES),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    pictures: Array.from({length: getRandomInteger(1, 5)}, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`,
      description: 'Random photo',
    })),
  }));

const createOffersByType = () => [
  {
    type: 'flight',
    offers: [
      {id: 'flight-1', title: 'Add luggage', price: 50},
      {id: 'flight-2', title: 'Switch to comfort', price: 80},
      {id: 'flight-3', title: 'Add meal', price: 15},
      {id: 'flight-4', title: 'Choose seats', price: 5},
      {id: 'flight-5', title: 'Travel by train', price: 40},
    ],
  },
  {
    type: 'taxi',
    offers: [
      {id: 'taxi-1', title: 'Order Uber', price: 20},
      {id: 'taxi-2', title: 'Add luggage', price: 30},
    ],
  },
  ...['check-in', 'train', 'ship', 'bus', 'drive', 'sightseeing', 'restaurant'].map((type) => ({type, offers: []})),
];

const createPoint = ({id, destinations, offersByType}) => {
  const type = getRandomArrayElement(POINT_TYPES);
  const destination = getRandomArrayElement(destinations).id;

  const dateFrom = getRandomDate();
  const dateTo = new Date(dateFrom);
  dateTo.setHours(dateFrom.getHours() + getRandomInteger(1, 8));

  const offersBlock = offersByType.find((o) => o.type === type);
  const offers = offersBlock
    ? offersBlock.offers.filter(() => Math.random() > 0.5).slice(0, 3).map((o) => o.id)
    : [];

  return {
    id: `point-${id}`,
    type,
    destination,
    offers,
    dateFrom: toISOString(dateFrom),
    dateTo: toISOString(dateTo),
    basePrice: getRandomInteger(20, 6000),
    isFavorite: Math.random() > 0.5,
  };
};

const generateMockData = (countPoints = 3) => {
  const destinations = createDestinations(6);
  const offersByType = createOffersByType();
  const points = Array.from({length: countPoints}, (_, idx) =>
    createPoint({id: idx + 1, destinations, offersByType})
  );

  return {destinations, offersByType, points};
};

export {generateMockData};
