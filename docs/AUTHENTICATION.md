# Authentication System

SpendWise Lite uses a simple email/password authentication system.

## Features

- **Email/Password Registration**: Users can register with their email and password
- **Secure Password Storage**: Passwords are hashed using bcrypt
- **JWT Tokens**: Authentication uses JWT tokens for session management
- **Immediate Access**: Users can log in immediately after registration

## API Endpoints

### Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

## Database Schema

The `users` table includes basic user information:

```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Frontend Integration

The frontend includes:

- **Login/Register Form**: Combined form that switches between login and registration
- **Error Handling**: Proper error messages for various scenarios
- **Automatic Login**: Users are automatically logged in after successful registration

## Security Features

- Passwords are hashed using bcrypt with 12 rounds
- JWT tokens have configurable expiration
- CORS protection enabled
- Input validation on all endpoints

## Usage

1. **Registration**: User enters email, password, and name → Account created and user logged in
2. **Login**: User enters email and password → JWT token issued
3. **Session Management**: JWT token stored in localStorage for persistent sessions

## Testing

The system is ready to use immediately. No email verification or external services required. 