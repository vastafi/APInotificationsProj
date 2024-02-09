import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../saving-goal.test-samples';

import { SavingGoalFormService } from './saving-goal-form.service';

describe('SavingGoal Form Service', () => {
  let service: SavingGoalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavingGoalFormService);
  });

  describe('Service methods', () => {
    describe('createSavingGoalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSavingGoalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            targetAmount: expect.any(Object),
            currentAmount: expect.any(Object),
            targetDate: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing ISavingGoal should create a new form with FormGroup', () => {
        const formGroup = service.createSavingGoalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            targetAmount: expect.any(Object),
            currentAmount: expect.any(Object),
            targetDate: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getSavingGoal', () => {
      it('should return NewSavingGoal for default SavingGoal initial value', () => {
        const formGroup = service.createSavingGoalFormGroup(sampleWithNewData);

        const savingGoal = service.getSavingGoal(formGroup) as any;

        expect(savingGoal).toMatchObject(sampleWithNewData);
      });

      it('should return NewSavingGoal for empty SavingGoal initial value', () => {
        const formGroup = service.createSavingGoalFormGroup();

        const savingGoal = service.getSavingGoal(formGroup) as any;

        expect(savingGoal).toMatchObject({});
      });

      it('should return ISavingGoal', () => {
        const formGroup = service.createSavingGoalFormGroup(sampleWithRequiredData);

        const savingGoal = service.getSavingGoal(formGroup) as any;

        expect(savingGoal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISavingGoal should not enable id FormControl', () => {
        const formGroup = service.createSavingGoalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSavingGoal should disable id FormControl', () => {
        const formGroup = service.createSavingGoalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
