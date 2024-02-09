import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IExpenseCategory } from 'app/entities/expense-category/expense-category.model';

export interface IExpense {
  id: number;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  user?: Pick<IUser, 'id'> | null;
  expenseCategory?: IExpenseCategory | null;
}

export type NewExpense = Omit<IExpense, 'id'> & { id: null };
