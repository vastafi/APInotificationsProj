import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExpenseCategory, NewExpenseCategory } from '../expense-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExpenseCategory for edit and NewExpenseCategoryFormGroupInput for create.
 */
type ExpenseCategoryFormGroupInput = IExpenseCategory | PartialWithRequiredKeyOf<NewExpenseCategory>;

type ExpenseCategoryFormDefaults = Pick<NewExpenseCategory, 'id'>;

type ExpenseCategoryFormGroupContent = {
  id: FormControl<IExpenseCategory['id'] | NewExpenseCategory['id']>;
  name: FormControl<IExpenseCategory['name']>;
};

export type ExpenseCategoryFormGroup = FormGroup<ExpenseCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExpenseCategoryFormService {
  createExpenseCategoryFormGroup(expenseCategory: ExpenseCategoryFormGroupInput = { id: null }): ExpenseCategoryFormGroup {
    const expenseCategoryRawValue = {
      ...this.getFormDefaults(),
      ...expenseCategory,
    };
    return new FormGroup<ExpenseCategoryFormGroupContent>({
      id: new FormControl(
        { value: expenseCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(expenseCategoryRawValue.name),
    });
  }

  getExpenseCategory(form: ExpenseCategoryFormGroup): IExpenseCategory | NewExpenseCategory {
    return form.getRawValue() as IExpenseCategory | NewExpenseCategory;
  }

  resetForm(form: ExpenseCategoryFormGroup, expenseCategory: ExpenseCategoryFormGroupInput): void {
    const expenseCategoryRawValue = { ...this.getFormDefaults(), ...expenseCategory };
    form.reset(
      {
        ...expenseCategoryRawValue,
        id: { value: expenseCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExpenseCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
