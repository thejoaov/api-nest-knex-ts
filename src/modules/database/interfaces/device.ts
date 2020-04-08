import { IUser } from './user';

export interface IDevice {
  id: string;
  userId?: number;
  name: string;
  currentToken: string;
  notificationToken?: string;

  user?: IUser;
}
