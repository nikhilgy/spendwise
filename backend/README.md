# SpendWise Backend API

A Node.js/Express backend API for the SpendWise Lite personal finance management application, powered by Supabase.

## Features

- 🔐 **Authentication**: JWT-based authentication with Supabase Auth
- 👤 **User Management**: User registration, login, and profile management
- 📊 **Categories**: Custom expense and income categories
- 💰 **Transactions**: Track income and expenses with detailed information
- 📈 **Analytics**: Transaction statistics and insights
- 🔒 **Security**: Row Level Security (RLS) policies for data protection
- 🚀 **Performance**: Optimized database queries and indexing

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Security**: Helmet, CORS, Row Level Security
- **Validation**: Express Validator
- **File Upload**: Multer

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API to get your project credentials
3. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service Role (secret) key

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   SESSION_SECRET=your_session_secret

   # Logging
   LOG_LEVEL=info
   ```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL to create all tables, indexes, and policies

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Categories
- `GET /api/categories` - Get user categories (protected)
- `GET /api/categories/defaults` - Get default categories (protected)
- `POST /api/categories` - Create new category (protected)
- `GET /api/categories/:id` - Get category by ID (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Transactions
- `GET /api/transactions` - Get user transactions (protected)
- `GET /api/transactions/stats` - Get transaction statistics (protected)
- `GET /api/transactions/recent` - Get recent transactions (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `GET /api/transactions/:id` - Get transaction by ID (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Database Schema

### Users Table
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile picture URL
- `currency` (TEXT) - Preferred currency (default: USD)
- `timezone` (TEXT) - User timezone (default: UTC)
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Categories Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `name` (TEXT) - Category name
- `icon` (TEXT) - Category icon emoji
- `color` (TEXT) - Category color hex
- `type` (TEXT) - 'income' or 'expense'
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Transactions Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `category_id` (UUID) - Foreign key to categories
- `amount` (DECIMAL) - Transaction amount
- `description` (TEXT) - Transaction description
- `type` (TEXT) - 'income' or 'expense'
- `date` (DATE) - Transaction date
- `tags` (TEXT[]) - Array of tags
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure users can only access their own data:

- Users can only view, update, and delete their own records
- Categories are scoped to the user who created them
- Transactions are scoped to the user who created them

### Authentication
- JWT tokens for API authentication
- Supabase Auth for user management
- Password hashing with bcrypt
- Token expiration and refresh

### Data Validation
- Input validation using Express Validator
- SQL injection prevention through parameterized queries
- XSS protection with Helmet

## Development

### Project Structure
```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Data models
├── routes/         # API routes
├── utils/          # Utility functions
└── server.js       # Main server file
```

### Adding New Features
1. Create model in `models/` directory
2. Create controller in `controllers/` directory
3. Create routes in `routes/` directory
4. Add database schema to `database/schema.sql`
5. Update server.js to include new routes

### Testing
```bash
# Run tests (when implemented)
npm test

# Health check
curl http://localhost:3001/health
```

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure CORS origins properly
- Set up proper logging

### Supabase Production Setup
- Use production Supabase project
- Configure custom domains if needed
- Set up proper backup strategies
- Monitor usage and performance

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase credentials in `.env`
   - Check if Supabase project is active
   - Ensure schema is properly set up

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure Supabase Auth is configured

3. **CORS Errors**
   - Update CORS_ORIGIN in `.env`
   - Check frontend URL configuration

4. **Permission Denied**
   - Verify RLS policies are set up correctly
   - Check user authentication status
   - Ensure proper user ownership of resources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 