import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer = null;

  #point = null;
  #destination = null;
  #offers = null;

  #pointComponent = null;
  #editFormComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;
  #escKeyDownHandler = null;

  constructor({pointsListContainer, onDataChange, onModeChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({point, destination, offers}) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    } else {
      this.#editFormComponent.setHandlers();
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    prevPointComponent.removeElement();
    prevEditFormComponent.removeElement();
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    this.#handleModeChange();

    this.#editFormComponent.setHandlers();
    replace(this.#editFormComponent, this.#pointComponent);

    this.#mode = Mode.EDITING;

    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#replaceFormToPoint();
      }
    };

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;

    if (this.#escKeyDownHandler) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#escKeyDownHandler = null;
    }
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#point = {...this.#point, isFavorite: !this.#point.isFavorite};
    this.#handleDataChange(this.#point);
  };
}
