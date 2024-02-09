import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 17056,
  notificationDate: dayjs('2024-02-06T14:03'),
};

export const sampleWithPartialData: INotification = {
  id: 21600,
  message: 'diagnose hence',
  notificationDate: dayjs('2024-02-06T19:53'),
};

export const sampleWithFullData: INotification = {
  id: 26379,
  message: 'sizzling but',
  isRead: false,
  notificationDate: dayjs('2024-02-07T03:38'),
};

export const sampleWithNewData: NewNotification = {
  notificationDate: dayjs('2024-02-07T08:55'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
