import type { TAppImage } from "@/types/common.types";

export interface IAppUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  bio?: string;
  avatarUrl?: TAppImage;
  isAdmin?: boolean;
  createdAt: string;
}
