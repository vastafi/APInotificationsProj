import { IMonthlyBudget } from 'app/entities/monthly-budget/monthly-budget.model';
import { IExpense } from 'app/entities/expense/expense.model';

export interface IExpenseCategory {
  id: number;
  name?: string | null;
  monthlyBudgets?: IMonthlyBudget[] | null;
  expenses?: IExpense[] | null;
}

export type NewExpenseCategory = Omit<IExpenseCategory, 'id'> & { id: null };
