import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMonthlyBudget, NewMonthlyBudget } from '../monthly-budget.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMonthlyBudget for edit and NewMonthlyBudgetFormGroupInput for create.
 */
type MonthlyBudgetFormGroupInput = IMonthlyBudget | PartialWithRequiredKeyOf<NewMonthlyBudget>;

type MonthlyBudgetFormDefaults = Pick<NewMonthlyBudget, 'id'>;

type MonthlyBudgetFormGroupContent = {
  id: FormControl<IMonthlyBudget['id'] | NewMonthlyBudget['id']>;
  amount: FormControl<IMonthlyBudget['amount']>;
  user: FormControl<IMonthlyBudget['user']>;
  expenseCategory: FormControl<IMonthlyBudget['expenseCategory']>;
};

export type MonthlyBudgetFormGroup = FormGroup<MonthlyBudgetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MonthlyBudgetFormService {
  createMonthlyBudgetFormGroup(monthlyBudget: MonthlyBudgetFormGroupInput = { id: null }): MonthlyBudgetFormGroup {
    const monthlyBudgetRawValue = {
      ...this.getFormDefaults(),
      ...monthlyBudget,
    };
    return new FormGroup<MonthlyBudgetFormGroupContent>({
      id: new FormControl(
        { value: monthlyBudgetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      amount: new FormControl(monthlyBudgetRawValue.amount),
      user: new FormControl(monthlyBudgetRawValue.user),
      expenseCategory: new FormControl(monthlyBudgetRawValue.expenseCategory),
    });
  }

  getMonthlyBudget(form: MonthlyBudgetFormGroup): IMonthlyBudget | NewMonthlyBudget {
    return form.getRawValue() as IMonthlyBudget | NewMonthlyBudget;
  }

  resetForm(form: MonthlyBudgetFormGroup, monthlyBudget: MonthlyBudgetFormGroupInput): void {
    const monthlyBudgetRawValue = { ...this.getFormDefaults(), ...monthlyBudget };
    form.reset(
      {
        ...monthlyBudgetRawValue,
        id: { value: monthlyBudgetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MonthlyBudgetFormDefaults {
    return {
      id: null,
    };
  }
}
