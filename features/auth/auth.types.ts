export type TUserRole = "user" | "admin";

export interface IApiUser {
  id: number;
  clerkId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: TUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown[];
}

export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface IRegisterFormValues {
  username: string;
  email: string;
  password: string;
}
