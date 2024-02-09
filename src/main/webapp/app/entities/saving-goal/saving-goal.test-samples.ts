import dayjs from 'dayjs/esm';

import { ISavingGoal, NewSavingGoal } from './saving-goal.model';

export const sampleWithRequiredData: ISavingGoal = {
  id: 20518,
};

export const sampleWithPartialData: ISavingGoal = {
  id: 1917,
  targetDate: dayjs('2024-02-07'),
};

export const sampleWithFullData: ISavingGoal = {
  id: 8754,
  targetAmount: 1869.58,
  currentAmount: 1673.53,
  targetDate: dayjs('2024-02-07'),
};

export const sampleWithNewData: NewSavingGoal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
