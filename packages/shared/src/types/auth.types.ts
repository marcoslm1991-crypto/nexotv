export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export interface UserPayload {
  id: string;
  alias: string;
  name?: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: UserPayload;
  subscription_status?: string;
  days_until_expiration?: number;
  warning_message?: string;
}
