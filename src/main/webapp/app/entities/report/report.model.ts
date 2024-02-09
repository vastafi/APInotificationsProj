import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IReport {
  id: number;
  generatedDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewReport = Omit<IReport, 'id'> & { id: null };
