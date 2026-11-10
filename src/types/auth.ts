export type Role = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_RECEPTIONIST' | 'ROLE_PROFESSIONAL';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: UserSession;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
