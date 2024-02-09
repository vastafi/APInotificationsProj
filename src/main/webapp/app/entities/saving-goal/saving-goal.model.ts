import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface ISavingGoal {
  id: number;
  targetAmount?: number | null;
  currentAmount?: number | null;
  targetDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewSavingGoal = Omit<ISavingGoal, 'id'> & { id: null };
