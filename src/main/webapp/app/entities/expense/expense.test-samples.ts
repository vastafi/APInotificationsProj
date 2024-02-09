import dayjs from 'dayjs/esm';

import { IExpense, NewExpense } from './expense.model';

export const sampleWithRequiredData: IExpense = {
  id: 25315,
};

export const sampleWithPartialData: IExpense = {
  id: 5800,
  amount: 12078.81,
  date: dayjs('2024-02-07T06:23'),
  description: 'atop while',
};

export const sampleWithFullData: IExpense = {
  id: 14132,
  amount: 10390.12,
  date: dayjs('2024-02-06T20:36'),
  description: 'indicator',
};

export const sampleWithNewData: NewExpense = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
