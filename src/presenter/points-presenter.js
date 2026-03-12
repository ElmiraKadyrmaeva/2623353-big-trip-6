import {render, RenderPosition} from '../render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import MakeFormView from '../view/make-form-view.js';
import PointView from '../view/point-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';

const POINT_COUNT = 3;

export default class PointsPresenter {
  constructor({tripControlsContainer, tripEventsContainer}) {
    this.tripControlsContainer = tripControlsContainer;
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(new FilterView(), this.tripControlsContainer);

    render(new SortView(), this.tripEventsContainer);

    const tripEventsListComponent = new TripEventsListView();
    render(tripEventsListComponent, this.tripEventsContainer);

    render(new EditFormView(), tripEventsListComponent.getElement(), RenderPosition.AFTERBEGIN);

    render(new MakeFormView(), tripEventsListComponent.getElement());

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new PointView(), tripEventsListComponent.getElement());
    }
  }
}
