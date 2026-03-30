export default class PointsModel {
  constructor({points, destinations, offersByType}) {
    this.points = points;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getPoints() {
    return this.points;
  }

  getDestinationById(id) {
    return this.destinations.find((d) => d.id === id);
  }

  getOffersByType(type) {
    return this.offersByType.find((o) => o.type === type);
  }
}
