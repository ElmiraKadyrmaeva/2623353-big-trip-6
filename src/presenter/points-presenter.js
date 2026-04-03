import {render, RenderPosition, replace} from '../framework/render.js';

import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class PointsPresenter {
  constructor({tripControlsContainer, tripEventsContainer, pointsModel}) {
    this.tripControlsContainer = tripControlsContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;

    this.tripEventsListComponent = null;
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

    render(new FilterView({filters}), this.tripControlsContainer);

    const points = this.pointsModel.getPoints();

    if (points.length === 0) {
      render(
        new EmptyListView({message: 'Click New Event to create your first point'}),
        this.tripEventsContainer
      );
      return;
    }

    render(new SortView({sortItems}), this.tripEventsContainer);

    this.tripEventsListComponent = new TripEventsListView();
    render(this.tripEventsListComponent, this.tripEventsContainer);

    points
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
