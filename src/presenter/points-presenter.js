import {render, remove} from '../framework/render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';

import PointPresenter from './point-presenter.js';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const sortByDay = (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom);

const sortByTime = (a, b) => {
  const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
  const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
  return durationB - durationA;
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export default class PointsPresenter {
  #tripControlsContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripEventsListComponent = null;
  #sortComponent = null;
  #emptyComponent = null;

  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;

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

    render(new FilterView({filters}), this.#tripControlsContainer);

    this.#renderBoard();
  }

  #getDestinations() {
    if (typeof this.#pointsModel.getDestinations === 'function') {
      return this.#pointsModel.getDestinations();
    }
    return this.#pointsModel.destinations ?? [];
  }

  #getOffersByTypeList() {
    if (typeof this.#pointsModel.getOffersByTypeList === 'function') {
      return this.#pointsModel.getOffersByTypeList();
    }
    return this.#pointsModel.offersByType ?? [];
  }

  #getSortedPoints() {
    const points = [...this.#pointsModel.getPoints()];

    switch (this.#currentSortType) {
      case SortType.TIME:
        points.sort(sortByTime);
        break;
      case SortType.PRICE:
        points.sort(sortByPrice);
        break;
      default:
        points.sort(sortByDay);
    }

    return points;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#handleModeChange();

    this.#clearBoard();
    this.#renderBoard();
  };

  #renderBoard() {
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      this.#emptyComponent = new EmptyListView({message: 'Click New Event to create your first point'});
      render(this.#emptyComponent, this.#tripEventsContainer);
      return;
    }

    const sortItems = [
      {type: SortType.DAY, title: 'Day', isChecked: this.#currentSortType === SortType.DAY, isDisabled: false},
      {type: 'event', title: 'Event', isChecked: false, isDisabled: true},
      {type: SortType.TIME, title: 'Time', isChecked: this.#currentSortType === SortType.TIME, isDisabled: false},
      {type: SortType.PRICE, title: 'Price', isChecked: this.#currentSortType === SortType.PRICE, isDisabled: false},
      {type: 'offers', title: 'Offers', isChecked: false, isDisabled: true},
    ];

    this.#sortComponent = new SortView({
      sortItems,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripEventsContainer);

    this.#tripEventsListComponent = new TripEventsListView();
    render(this.#tripEventsListComponent, this.#tripEventsContainer);

    this.#renderPoints(points.slice(0, 5));
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init({
      point,
      destinations: this.#getDestinations(),
      offersByType: this.#getOffersByTypeList(),
    });

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

    const presenter = this.#pointPresenters.get(updatedPoint.id);
    if (!presenter) {
      return;
    }

    presenter.init({
      point: updatedPoint,
      destinations: this.#getDestinations(),
      offersByType: this.#getOffersByTypeList(),
    });
  };

  #clearBoard() {
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#tripEventsListComponent) {
      remove(this.#tripEventsListComponent);
      this.#tripEventsListComponent = null;
    }

    this.#pointPresenters.clear();
  }
}
