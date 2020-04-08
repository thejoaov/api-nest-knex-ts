export interface ICurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  roles: string[];
}
