export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
