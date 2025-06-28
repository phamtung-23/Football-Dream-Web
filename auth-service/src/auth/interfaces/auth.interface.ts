export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: Date;
  password?: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface JwtPayload {
  email: string;
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}
