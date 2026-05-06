import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isPointFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());

const isPointPresent = (point) => {
  const now = dayjs();
  const dateFrom = dayjs(point.dateFrom);
  const dateTo = dayjs(point.dateTo);

  return (dateFrom.isBefore(now) || dateFrom.isSame(now))
    && (dateTo.isAfter(now) || dateTo.isSame(now));
};

const isPointPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast),
};

export {filter};
