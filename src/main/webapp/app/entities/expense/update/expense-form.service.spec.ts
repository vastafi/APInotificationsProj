import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../expense.test-samples';

import { ExpenseFormService } from './expense-form.service';

describe('Expense Form Service', () => {
  let service: ExpenseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseFormService);
  });

  describe('Service methods', () => {
    describe('createExpenseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExpenseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            user: expect.any(Object),
            expenseCategory: expect.any(Object),
          }),
        );
      });

      it('passing IExpense should create a new form with FormGroup', () => {
        const formGroup = service.createExpenseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            user: expect.any(Object),
            expenseCategory: expect.any(Object),
          }),
        );
      });
    });

    describe('getExpense', () => {
      it('should return NewExpense for default Expense initial value', () => {
        const formGroup = service.createExpenseFormGroup(sampleWithNewData);

        const expense = service.getExpense(formGroup) as any;

        expect(expense).toMatchObject(sampleWithNewData);
      });

      it('should return NewExpense for empty Expense initial value', () => {
        const formGroup = service.createExpenseFormGroup();

        const expense = service.getExpense(formGroup) as any;

        expect(expense).toMatchObject({});
      });

      it('should return IExpense', () => {
        const formGroup = service.createExpenseFormGroup(sampleWithRequiredData);

        const expense = service.getExpense(formGroup) as any;

        expect(expense).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExpense should not enable id FormControl', () => {
        const formGroup = service.createExpenseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExpense should disable id FormControl', () => {
        const formGroup = service.createExpenseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
