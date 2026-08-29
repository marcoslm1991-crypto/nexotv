export type RootScreen = 
  | 'LOGIN'
  | 'PROFILE_SELECTION'
  | 'HOME'
  | 'LIVE_TV'
  | 'SERIES'
  | 'MOVIES'
  | 'MY_LIST'
  | 'ACCOUNT';

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface UserSubscriptionInfo {
  status: 'VIGENTE' | 'PROXIMO_A_VENCER' | 'VENCIDO' | 'SUSPENDIDO' | 'SIN_SUSCRIPCION';
  days_remaining: number;
  expiration_date?: string;
  warning_message?: string;
}

export interface UserSession {
  id: string;
  alias: string;
  name?: string;
  token: string;
  subscription: UserSubscriptionInfo;
}
