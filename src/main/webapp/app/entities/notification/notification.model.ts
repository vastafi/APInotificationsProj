import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface INotification {
  id: number;
  message?: string | null;
  isRead?: boolean | null;
  notificationDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
