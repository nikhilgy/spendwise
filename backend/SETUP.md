# Backend Setup Guide

This guide will help you set up the SpendWise Lite backend with SSO authentication and transaction import functionality.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Google OAuth credentials

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

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
MAX_FILE_SIZE=10485760 # 10MB
UPLOAD_PATH=./uploads

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=your_session_secret

# Logging
LOG_LEVEL=info
```

### 3. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your project URL and keys
4. Run the database schema:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/schema.sql
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Run the schema:

```bash
psql -d your_database_name -f database/schema.sql
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
5. Copy the Client ID and Client Secret to your `.env` file

### 5. Test Connection

Test your database connection:

```bash
npm run test:connection
```

### 6. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/recent` - Get recent transactions
- `POST /api/transactions/import` - Import transactions
- `POST /api/transactions/parse-csv` - Parse CSV data

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Import Functionality

The backend supports importing transactions from various sources:

### CSV Import
- Supports standard CSV format with headers
- Automatically parses date, amount, description, type, and category
- Provides preview before import
- Handles errors gracefully

### PDF Import (Basic)
- Currently supports basic PDF parsing
- Requires password for encrypted PDFs
- Extracts transaction data from bank statements

### JSON Import
- Supports exported transaction data
- Maintains data structure and relationships

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading.

### Testing

```bash
npm test
```

### Database Migrations

To add new database migrations:

1. Create a new SQL file in `database/migrations/`
2. Update the schema.sql file
3. Run the migration manually or use a migration tool

## Production Deployment

### Environment Variables

Make sure to set all required environment variables for production:

- Use strong JWT secrets
- Set NODE_ENV=production
- Configure proper CORS origins
- Use HTTPS URLs for OAuth callbacks

### Security Considerations

- Use HTTPS in production
- Set secure session cookies
- Implement rate limiting
- Use environment variables for secrets
- Regular security updates

### Performance

- Enable database connection pooling
- Implement caching where appropriate
- Monitor API response times
- Use compression middleware

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your Supabase credentials
   - Verify database URL format
   - Ensure database is accessible

2. **Google OAuth Not Working**
   - Verify OAuth credentials
   - Check redirect URI configuration
   - Ensure Google+ API is enabled

3. **CORS Errors**
   - Update CORS_ORIGIN in .env
   - Check frontend URL configuration

4. **Import Failures**
   - Check file format and size
   - Verify CSV headers
   - Review error logs

### Logs

Check the console output for detailed error messages and logs.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the frontend integration guide 