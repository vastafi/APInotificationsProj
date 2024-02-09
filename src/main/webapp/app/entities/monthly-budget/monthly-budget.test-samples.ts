import { IMonthlyBudget, NewMonthlyBudget } from './monthly-budget.model';

export const sampleWithRequiredData: IMonthlyBudget = {
  id: 29247,
};

export const sampleWithPartialData: IMonthlyBudget = {
  id: 3758,
  amount: 24770.97,
};

export const sampleWithFullData: IMonthlyBudget = {
  id: 23641,
  amount: 25776.22,
};

export const sampleWithNewData: NewMonthlyBudget = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
