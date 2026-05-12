import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offersByType = [];

  constructor({points, destinations, offersByType}) {
    super();

    this.#points = points;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  getPoints() {
    return this.#points;
  }

  setPoints(updateType, points) {
    this.#points = points;

    this._notify(updateType);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffersByTypeList() {
    return this.#offersByType;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    return this.#offersByType.find((offersBlock) => offersBlock.type === type);
  }
}
