import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExpense, NewExpense } from '../expense.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExpense for edit and NewExpenseFormGroupInput for create.
 */
type ExpenseFormGroupInput = IExpense | PartialWithRequiredKeyOf<NewExpense>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IExpense | NewExpense> = Omit<T, 'date'> & {
  date?: string | null;
};

type ExpenseFormRawValue = FormValueOf<IExpense>;

type NewExpenseFormRawValue = FormValueOf<NewExpense>;

type ExpenseFormDefaults = Pick<NewExpense, 'id' | 'date'>;

type ExpenseFormGroupContent = {
  id: FormControl<ExpenseFormRawValue['id'] | NewExpense['id']>;
  amount: FormControl<ExpenseFormRawValue['amount']>;
  date: FormControl<ExpenseFormRawValue['date']>;
  description: FormControl<ExpenseFormRawValue['description']>;
  user: FormControl<ExpenseFormRawValue['user']>;
  expenseCategory: FormControl<ExpenseFormRawValue['expenseCategory']>;
};

export type ExpenseFormGroup = FormGroup<ExpenseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExpenseFormService {
  createExpenseFormGroup(expense: ExpenseFormGroupInput = { id: null }): ExpenseFormGroup {
    const expenseRawValue = this.convertExpenseToExpenseRawValue({
      ...this.getFormDefaults(),
      ...expense,
    });
    return new FormGroup<ExpenseFormGroupContent>({
      id: new FormControl(
        { value: expenseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      amount: new FormControl(expenseRawValue.amount),
      date: new FormControl(expenseRawValue.date),
      description: new FormControl(expenseRawValue.description, {
        validators: [Validators.maxLength(1000)],
      }),
      user: new FormControl(expenseRawValue.user),
      expenseCategory: new FormControl(expenseRawValue.expenseCategory),
    });
  }

  getExpense(form: ExpenseFormGroup): IExpense | NewExpense {
    return this.convertExpenseRawValueToExpense(form.getRawValue() as ExpenseFormRawValue | NewExpenseFormRawValue);
  }

  resetForm(form: ExpenseFormGroup, expense: ExpenseFormGroupInput): void {
    const expenseRawValue = this.convertExpenseToExpenseRawValue({ ...this.getFormDefaults(), ...expense });
    form.reset(
      {
        ...expenseRawValue,
        id: { value: expenseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExpenseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertExpenseRawValueToExpense(rawExpense: ExpenseFormRawValue | NewExpenseFormRawValue): IExpense | NewExpense {
    return {
      ...rawExpense,
      date: dayjs(rawExpense.date, DATE_TIME_FORMAT),
    };
  }

  private convertExpenseToExpenseRawValue(
    expense: IExpense | (Partial<NewExpense> & ExpenseFormDefaults),
  ): ExpenseFormRawValue | PartialWithRequiredKeyOf<NewExpenseFormRawValue> {
    return {
      ...expense,
      date: expense.date ? expense.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
