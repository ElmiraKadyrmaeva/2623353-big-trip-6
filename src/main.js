import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import {generateMockData} from './mock/generator.js';

console.log('MAIN START');
console.log('generateMockData type:', typeof generateMockData);

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const {destinations, offersByType, points} = generateMockData(3);

const pointsModel = new PointsModel({
  points,
  destinations,
  offersByType,
});

const pointsPresenter = new PointsPresenter({
  tripControlsContainer,
  tripEventsContainer,
  pointsModel,
});

pointsPresenter.init();
