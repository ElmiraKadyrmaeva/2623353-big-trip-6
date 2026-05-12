import PointsPresenter from './presenter/points-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import {generateMockData} from './mock/generator.js';

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const {destinations, offersByType, points} = generateMockData(5);

const pointsModel = new PointsModel({
  points,
  destinations,
  offersByType,
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsContainer,
  filterModel,
  pointsModel,
});

const pointsPresenter = new PointsPresenter({
  tripEventsContainer,
  pointsModel,
  filterModel,
  newPointButton,
});

filterPresenter.init();
pointsPresenter.init();
