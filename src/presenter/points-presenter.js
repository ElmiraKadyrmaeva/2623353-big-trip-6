import {render, RenderPosition} from '../render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditFormView from '../view/edit-form-view.js';
import MakeFormView from '../view/make-form-view.js';
import PointView from '../view/point-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';

export default class PointsPresenter {
  constructor({tripControlsContainer, tripEventsContainer, pointsModel}) {
    this.tripControlsContainer = tripControlsContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    render(new FilterView(), this.tripControlsContainer);
    render(new SortView(), this.tripEventsContainer);

    const tripEventsListComponent = new TripEventsListView();
    render(tripEventsListComponent, this.tripEventsContainer);

    render(new EditFormView(), tripEventsListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(new MakeFormView(), tripEventsListComponent.getElement());

    this.pointsModel.getPoints()
      .slice(-3)
      .forEach((point) => {
        const destination = this.pointsModel.getDestinationById(point.destination);
        const offersByType = this.pointsModel.getOffersByType(point.type);
        const offers = offersByType ? offersByType.offers : [];

        render(new PointView({point, destination, offers}), tripEventsListComponent.getElement());
      });
  }
}
