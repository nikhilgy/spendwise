# SpendWise Lite - Personal Finance Management

A modern, responsive personal finance management application with SSO login and transaction import capabilities.

## Features

- 🔐 **SSO Authentication** - Google OAuth integration
- 📊 **Transaction Management** - Track income and expenses
- 📈 **Analytics Dashboard** - Visual insights into spending patterns
- 📁 **Import Transactions** - Support for CSV, PDF, and JSON imports
- 🎯 **Event Tracking** - Monitor spending during specific time periods
- 💳 **Card Management** - Manage multiple payment methods
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js with Express
- PostgreSQL with Supabase
- Passport.js for authentication
- Google OAuth 2.0
- JWT for session management

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Google OAuth credentials

### Backend Setup

1. **Clone and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
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
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   SESSION_SECRET=your_session_secret
   ```

3. **Database Setup:**
   ```bash
   # Run the database schema
   psql -d your_database -f database/schema.sql
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

## Import Functionality

### Supported Formats

- **CSV**: Standard comma-separated values with headers
- **PDF**: Bank statements (basic support)
- **JSON**: Exported transaction data

### CSV Format Example

```csv
date,description,amount,type,category
2024-01-15,Grocery Store,-50.00,expense,Food
2024-01-16,Salary,2000.00,income,Salary
```

### Import Process

1. Click "Import Transactions" on the dashboard
2. Select file type (CSV/PDF/JSON)
3. Upload your file
4. Review preview of parsed transactions
5. Confirm import
6. View results with success/error counts

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/import` - Import transactions
- `POST /api/transactions/parse-csv` - Parse CSV data

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
npm test     # Run tests
```

### Frontend Development
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Build and deploy to your preferred platform (Heroku, Railway, etc.)
3. Update CORS_ORIGIN to your frontend domain

### Frontend Deployment
1. Update VITE_API_URL to your backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
