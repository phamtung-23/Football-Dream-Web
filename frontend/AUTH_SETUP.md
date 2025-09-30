# NextAuth.js Setup Guide

## Overview
This project has been migrated from Clerk to NextAuth.js with username/password authentication.

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Generating NEXTAUTH_SECRET
You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## Default Users
The application comes with two default users for testing:

1. **Admin User**
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `password123`

2. **Regular User**
   - Username: `user`
   - Email: `user@example.com`
   - Password: `password123`

## Features
- ✅ Username/password authentication
- ✅ Protected routes with middleware
- ✅ Session management
- ✅ User profile display
- ✅ Sign out functionality

## File Changes Made
- Replaced Clerk dependencies with NextAuth.js
- Updated all authentication components
- Modified middleware for route protection
- Updated user navigation and profile components
- Created custom sign-in/sign-up forms

## Next Steps
1. Set up your environment variables
2. Run `yarn install` to install dependencies
3. Start the development server with `yarn dev`
4. Navigate to `/auth/sign-in` to test authentication

## Customization
- Modify user data in `/src/app/api/auth/[...nextauth]/route.ts`
- Customize forms in `/src/features/auth/components/user-auth-form.tsx`
- Update protected routes in `/src/middleware.ts`
