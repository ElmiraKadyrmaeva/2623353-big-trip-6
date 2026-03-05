import PointsPresenter from './presenter/points-presenter.js';

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsPresenter = new PointsPresenter({
  tripControlsContainer,
  tripEventsContainer,
});

pointsPresenter.init();
