import {render, RenderPosition, replace} from '../framework/render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';

export default class PointsPresenter {
  constructor({tripControlsContainer, tripEventsContainer, pointsModel}) {
    this.tripControlsContainer = tripControlsContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;

    this.tripEventsListComponent = null;
  }

  init() {
    render(new FilterView(), this.tripControlsContainer);
    render(new SortView(), this.tripEventsContainer);

    this.tripEventsListComponent = new TripEventsListView();
    render(this.tripEventsListComponent, this.tripEventsContainer);

    this.pointsModel.getPoints()
      .slice(-5)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const destination = this.pointsModel.getDestinationById(point.destination);
    const offersByType = this.pointsModel.getOffersByType(point.type);
    const offers = offersByType ? offersByType.offers : [];

    let pointComponent = null;
    let editFormComponent = null;

    let onEscKeyDown = null;

    const replaceFormToPoint = () => {
      replace(pointComponent, editFormComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const replacePointToForm = () => {
      editFormComponent.setHandlers();
      replace(editFormComponent, pointComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    pointComponent = new PointView({
      point,
      destination,
      offers,
      onEditClick: replacePointToForm,
    });

    editFormComponent = new EditFormView({
      point,
      destination,
      offers,
      onFormSubmit: (evt) => {
        evt.preventDefault();
        replaceFormToPoint();
      },
      onRollupClick: replaceFormToPoint,
    });

    render(pointComponent, this.tripEventsListComponent.element, RenderPosition.BEFOREEND);
  }
}
