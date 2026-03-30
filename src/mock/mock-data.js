const MOCK_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Chamonix',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    pictures: [
      {src: 'https://loremflickr.com/248/152?random=11', description: 'Chamonix'},
      {src: 'https://loremflickr.com/248/152?random=12', description: 'Chamonix'},
    ],
  },
  {
    id: 'dest-2',
    name: 'Geneva',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.',
    pictures: [
      {src: 'https://loremflickr.com/248/152?random=21', description: 'Geneva'},
      {src: 'https://loremflickr.com/248/152?random=22', description: 'Geneva'},
    ],
  },
];

const MOCK_OFFERS_BY_TYPE = [
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
  {
    type: 'check-in',
    offers: [],
  },
  {
    type: 'train',
    offers: [],
  },
  {
    type: 'ship',
    offers: [],
  },
];

const MOCK_POINTS = [
  {
    id: 'point-1',
    type: 'flight',
    destination: 'dest-1',
    offers: ['flight-1', 'flight-2', 'flight-5'],
    dateFrom: '2019-03-18T12:25:00.000Z',
    dateTo: '2019-03-18T13:35:00.000Z',
    basePrice: 160,
    isFavorite: false,
  },
  {
    id: 'point-2',
    type: 'check-in',
    destination: 'dest-2',
    offers: [],
    dateFrom: '2019-04-18T08:26:00.000Z',
    dateTo: '2019-04-18T17:44:00.000Z',
    basePrice: 561,
    isFavorite: false,
  },
  {
    id: 'point-3',
    type: 'train',
    destination: 'dest-1',
    offers: [],
    dateFrom: '2019-02-24T04:14:00.000Z',
    dateTo: '2019-02-24T15:10:00.000Z',
    basePrice: 3947,
    isFavorite: true,
  },
  {
    id: 'point-4',
    type: 'ship',
    destination: 'dest-2',
    offers: [],
    dateFrom: '2019-03-06T01:05:00.000Z',
    dateTo: '2019-03-06T19:02:00.000Z',
    basePrice: 3539,
    isFavorite: true,
  },
];

export {MOCK_DESTINATIONS, MOCK_OFFERS_BY_TYPE, MOCK_POINTS};
