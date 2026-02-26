export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
  schoolId?: string | null;
  studentId?: string | null;
  controllerId?: string | null;
}

export interface Session {
  session: {
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
  user: User;
}

export interface AuthError {
  message: string;
  status?: number;
}
