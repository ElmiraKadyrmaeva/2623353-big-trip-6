import {render} from '../framework/render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';

import PointPresenter from './point-presenter.js';

export default class PointsPresenter {
  #tripControlsContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripEventsListComponent = null;

  #pointPresenters = new Map();

  constructor({tripControlsContainer, tripEventsContainer, pointsModel}) {
    this.#tripControlsContainer = tripControlsContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const filters = [
      {type: 'everything', title: 'Everything', isChecked: true, isDisabled: false},
      {type: 'future', title: 'Future', isChecked: false, isDisabled: false},
      {type: 'present', title: 'Present', isChecked: false, isDisabled: false},
      {type: 'past', title: 'Past', isChecked: false, isDisabled: false},
    ];

    const sortItems = [
      {type: 'day', title: 'Day', isChecked: true, isDisabled: false},
      {type: 'event', title: 'Event', isChecked: false, isDisabled: true},
      {type: 'time', title: 'Time', isChecked: false, isDisabled: true},
      {type: 'price', title: 'Price', isChecked: false, isDisabled: true},
      {type: 'offers', title: 'Offers', isChecked: false, isDisabled: true},
    ];

    render(new FilterView({filters}), this.#tripControlsContainer);

    const points = this.#pointsModel.getPoints();
    if (points.length === 0) {
      render(new EmptyListView({message: 'Click New Event to create your first point'}), this.#tripEventsContainer);
      return;
    }

    render(new SortView({sortItems}), this.#tripEventsContainer);

    this.#tripEventsListComponent = new TripEventsListView();
    render(this.#tripEventsListComponent, this.#tripEventsContainer);

    this.#renderPoints(points.slice(-5));
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offersByType = this.#pointsModel.getOffersByType(point.type);
    const offers = offersByType ? offersByType.offers : [];

    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init({point, destination, offers});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    const points = this.#pointsModel.getPoints();
    const index = points.findIndex((p) => p.id === updatedPoint.id);
    if (index === -1) {
      return;
    }

    points[index] = updatedPoint;

    const destination = this.#pointsModel.getDestinationById(updatedPoint.destination);
    const offersByType = this.#pointsModel.getOffersByType(updatedPoint.type);
    const offers = offersByType ? offersByType.offers : [];

    this.#pointPresenters.get(updatedPoint.id).init({
      point: updatedPoint,
      destination,
      offers,
    });
  };
}
