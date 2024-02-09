import { IUser } from 'app/entities/user/user.model';
import { IExpenseCategory } from 'app/entities/expense-category/expense-category.model';

export interface IMonthlyBudget {
  id: number;
  amount?: number | null;
  user?: Pick<IUser, 'id'> | null;
  expenseCategory?: IExpenseCategory | null;
}

export type NewMonthlyBudget = Omit<IMonthlyBudget, 'id'> & { id: null };
