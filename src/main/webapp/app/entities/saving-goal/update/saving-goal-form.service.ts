import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISavingGoal, NewSavingGoal } from '../saving-goal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISavingGoal for edit and NewSavingGoalFormGroupInput for create.
 */
type SavingGoalFormGroupInput = ISavingGoal | PartialWithRequiredKeyOf<NewSavingGoal>;

type SavingGoalFormDefaults = Pick<NewSavingGoal, 'id'>;

type SavingGoalFormGroupContent = {
  id: FormControl<ISavingGoal['id'] | NewSavingGoal['id']>;
  targetAmount: FormControl<ISavingGoal['targetAmount']>;
  currentAmount: FormControl<ISavingGoal['currentAmount']>;
  targetDate: FormControl<ISavingGoal['targetDate']>;
  user: FormControl<ISavingGoal['user']>;
};

export type SavingGoalFormGroup = FormGroup<SavingGoalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SavingGoalFormService {
  createSavingGoalFormGroup(savingGoal: SavingGoalFormGroupInput = { id: null }): SavingGoalFormGroup {
    const savingGoalRawValue = {
      ...this.getFormDefaults(),
      ...savingGoal,
    };
    return new FormGroup<SavingGoalFormGroupContent>({
      id: new FormControl(
        { value: savingGoalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      targetAmount: new FormControl(savingGoalRawValue.targetAmount),
      currentAmount: new FormControl(savingGoalRawValue.currentAmount),
      targetDate: new FormControl(savingGoalRawValue.targetDate),
      user: new FormControl(savingGoalRawValue.user),
    });
  }

  getSavingGoal(form: SavingGoalFormGroup): ISavingGoal | NewSavingGoal {
    return form.getRawValue() as ISavingGoal | NewSavingGoal;
  }

  resetForm(form: SavingGoalFormGroup, savingGoal: SavingGoalFormGroupInput): void {
    const savingGoalRawValue = { ...this.getFormDefaults(), ...savingGoal };
    form.reset(
      {
        ...savingGoalRawValue,
        id: { value: savingGoalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SavingGoalFormDefaults {
    return {
      id: null,
    };
  }
}
