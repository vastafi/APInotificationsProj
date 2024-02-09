import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../monthly-budget.test-samples';

import { MonthlyBudgetFormService } from './monthly-budget-form.service';

describe('MonthlyBudget Form Service', () => {
  let service: MonthlyBudgetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyBudgetFormService);
  });

  describe('Service methods', () => {
    describe('createMonthlyBudgetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMonthlyBudgetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            user: expect.any(Object),
            expenseCategory: expect.any(Object),
          }),
        );
      });

      it('passing IMonthlyBudget should create a new form with FormGroup', () => {
        const formGroup = service.createMonthlyBudgetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            user: expect.any(Object),
            expenseCategory: expect.any(Object),
          }),
        );
      });
    });

    describe('getMonthlyBudget', () => {
      it('should return NewMonthlyBudget for default MonthlyBudget initial value', () => {
        const formGroup = service.createMonthlyBudgetFormGroup(sampleWithNewData);

        const monthlyBudget = service.getMonthlyBudget(formGroup) as any;

        expect(monthlyBudget).toMatchObject(sampleWithNewData);
      });

      it('should return NewMonthlyBudget for empty MonthlyBudget initial value', () => {
        const formGroup = service.createMonthlyBudgetFormGroup();

        const monthlyBudget = service.getMonthlyBudget(formGroup) as any;

        expect(monthlyBudget).toMatchObject({});
      });

      it('should return IMonthlyBudget', () => {
        const formGroup = service.createMonthlyBudgetFormGroup(sampleWithRequiredData);

        const monthlyBudget = service.getMonthlyBudget(formGroup) as any;

        expect(monthlyBudget).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMonthlyBudget should not enable id FormControl', () => {
        const formGroup = service.createMonthlyBudgetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMonthlyBudget should disable id FormControl', () => {
        const formGroup = service.createMonthlyBudgetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
