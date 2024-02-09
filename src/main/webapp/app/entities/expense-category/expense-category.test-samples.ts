import { IExpenseCategory, NewExpenseCategory } from './expense-category.model';

export const sampleWithRequiredData: IExpenseCategory = {
  id: 4712,
};

export const sampleWithPartialData: IExpenseCategory = {
  id: 20327,
};

export const sampleWithFullData: IExpenseCategory = {
  id: 26456,
  name: 'how wherever excepting',
};

export const sampleWithNewData: NewExpenseCategory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
