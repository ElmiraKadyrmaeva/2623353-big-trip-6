import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import {generateMockData} from './mock/generator.js';

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const {destinations, offersByType, points} = generateMockData(5);

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
