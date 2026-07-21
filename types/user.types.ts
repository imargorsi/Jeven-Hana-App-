export interface IAppUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  createdAt: string;
}
