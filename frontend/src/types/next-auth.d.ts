import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    accessToken?: string;
    role?: string;
    isEmailVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role?: string;
      isEmailVerified?: boolean;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    accessToken?: string;
    role?: string;
    isEmailVerified?: boolean;
  }
}
