# Enhanced Authentication Features

This documentation covers the enhanced authentication system for the Football Web application, which includes comprehensive user management features following NestJS best practices.

## Features Implemented

### 1. User Registration & Email Verification
- **User Registration**: Users can register with email, password, first name, and last name
- **Email Verification**: Email verification is required for new accounts
- **Resend Verification**: Users can request a new verification email if needed

### 2. Password Management
- **Forgot Password**: Users can request password reset via email
- **Reset Password**: Secure password reset using time-limited tokens
- **Change Password**: Authenticated users can change their password
- **Password Strength**: Enforced password requirements (uppercase, lowercase, numbers)

### 3. Two-Factor Authentication (2FA)
- **OTP Generation**: 6-digit OTP codes for additional security
- **OTP Verification**: Login using OTP code as alternative to password
- **Time-Limited OTP**: OTP codes expire after 10 minutes

### 4. Security Features
- **Rate Limiting**: Protection against brute force attacks
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Token Expiration**: Time-limited tokens for password reset and email verification

## API Endpoints

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isEmailVerified": false
  }
}
```

#### POST `/auth/login`
Authenticate user with email and password.
- **Rate Limited**: 5 attempts per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isEmailVerified": true
  }
}
```

#### POST `/auth/verify-email`
Verify email address using verification token.

**Request Body:**
```json
{
  "token": "verification-token"
}
```

#### POST `/auth/resend-verification`
Resend email verification link.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/auth/forgot-password`
Request password reset email.
- **Rate Limited**: 3 attempts per minute

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewPassword123"
}
```

#### PATCH `/auth/change-password`
Change password for authenticated user.
- **Requires Authentication**

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123",
  "newPassword": "NewPassword123"
}
```

#### POST `/auth/send-otp`
Send OTP code to user's email.
- **Rate Limited**: 3 attempts per minute

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/auth/verify-otp`
Verify OTP code and login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

#### GET `/auth/profile`
Get current user profile.
- **Requires Authentication**

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "avatar": null,
    "createdAt": "2025-06-22T17:12:44.000Z"
  }
}
```

## Database Schema Changes

The User model has been enhanced with the following fields:

```prisma
model User {
  id                    String   @id @default(cuid())
  email                 String   @unique
  password              String
  firstName             String?
  lastName              String?
  avatar                String?
  role                  UserRole @default(USER)
  isActive              Boolean  @default(true)
  isEmailVerified       Boolean  @default(false)
  emailVerificationToken String?
  passwordResetToken    String?
  passwordResetExpires  DateTime?
  otpCode               String?
  otpExpires            DateTime?
  lastLoginAt           DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

## Email Configuration

The application uses nodemailer for sending emails. Configure the following environment variables:

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@football-app.com"
FRONTEND_URL="http://localhost:3000"
```

### Email Templates

1. **Email Verification**: Sent upon registration
2. **Password Reset**: Sent when user requests password reset
3. **OTP Code**: Sent when user requests OTP for 2FA

## Security Best Practices Implemented

1. **Rate Limiting**: Prevents brute force attacks on sensitive endpoints
2. **Password Strength**: Enforced minimum requirements with regex validation
3. **Token Expiration**: All tokens have expiration times
4. **Secure Password Storage**: bcryptjs with salt rounds
5. **Input Validation**: class-validator decorators for all DTOs
6. **JWT Security**: Configurable secret and expiration
7. **Error Handling**: Consistent error responses without information leakage

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure database connection
3. Set JWT secret (change in production)
4. Configure SMTP settings for email functionality
5. Set frontend URL for email links

## Migration

Run the database migration to add new authentication fields:

```bash
npx prisma migrate dev
```

## Testing

Use tools like Postman or Thunder Client to test the endpoints. Swagger documentation is available at `/api` when the server is running.

## Next Steps

Consider implementing:
1. Social authentication (Google, Facebook, etc.)
2. Account lockout after failed attempts
3. Password history to prevent reuse
4. Email templates customization
5. Multi-language support for emails
6. Admin endpoints for user management
