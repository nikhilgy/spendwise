# SpendWise Lite - User Onboarding Features

## Overview

This document describes the user onboarding features implemented in SpendWise Lite, which guide new users through setting up their account and importing their financial data.

## Features Implemented

### 1. User Profile Setup
- **Location**: `/onboarding` route
- **Components**: `OnboardingPage.tsx`, `UserProfileManager.tsx`
- **Features**:
  - Complete user profile information
  - Set currency preferences (USD, EUR, GBP, INR)
  - Configure timezone settings
  - Form validation and error handling

### 2. Bank Account Management
- **Backend**: `BankAccount.js` model, `bankAccountController.js`
- **API Routes**: `/api/bank-accounts/*`
- **Features**:
  - Add multiple bank accounts
  - Support for savings and checking accounts
  - Account balance tracking
  - Bank account statistics
  - CRUD operations (Create, Read, Update, Delete)

### 3. Credit/Debit Card Management
- **Backend**: `Card.js` model (existing)
- **API Routes**: `/api/cards/*` (existing)
- **Features**:
  - Add credit and debit cards
  - Track card details (issuer, last 4 digits, type)
  - Billing cycle management for credit cards
  - Reward rules configuration
  - Card suggestions for transactions

### 4. PDF Transaction Import
- **Backend**: `pdfImportService.js`, `pdfImportController.js`
- **API Routes**: `/api/pdf-import/*`
- **Features**:
  - PDF file upload and validation
  - Transaction extraction from bank statements
  - Automatic transaction categorization
  - Import history tracking
  - File cleanup and error handling

## Database Schema Updates

### New Tables
- `bank_accounts`: Stores user bank account information
- Updated `transactions` table with `bank_account_id` and `source` fields

### Key Fields
```sql
-- Bank Accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT,
    account_type TEXT CHECK (account_type IN ('savings', 'checking')),
    current_balance DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Updated Transactions
ALTER TABLE transactions ADD COLUMN bank_account_id UUID REFERENCES bank_accounts(id);
ALTER TABLE transactions ADD COLUMN source TEXT DEFAULT 'Manual Entry';
```

## API Endpoints

### Bank Accounts
- `GET /api/bank-accounts` - Get all bank accounts for user
- `GET /api/bank-accounts/:id` - Get specific bank account
- `POST /api/bank-accounts` - Create new bank account
- `PUT /api/bank-accounts/:id` - Update bank account
- `DELETE /api/bank-accounts/:id` - Delete bank account
- `GET /api/bank-accounts/stats` - Get bank account statistics
- `PATCH /api/bank-accounts/:id/balance` - Update account balance

### PDF Import
- `POST /api/pdf-import/upload` - Upload and process PDF file
- `POST /api/pdf-import/validate` - Validate uploaded file
- `POST /api/pdf-import/extract` - Extract transactions from data
- `POST /api/pdf-import/save` - Save extracted transactions
- `GET /api/pdf-import/history` - Get import history

## Frontend Components

### Onboarding Flow
- **OnboardingPage**: Main onboarding wizard with step-by-step flow
- **ProfileSetupStep**: User profile configuration
- **BankAccountsStep**: Bank account management
- **CardsStep**: Credit/debit card management
- **ImportTransactionsStep**: PDF import functionality

### UI Components Used
- `DzenCard`: Card container component
- `DzenButton`: Button component with variants
- `LoadingSpinner`: Loading indicator
- Custom styled form elements

## Usage

### Starting Onboarding
1. Navigate to `/onboarding` after user login
2. Complete each step in the wizard:
   - Profile setup
   - Bank account addition
   - Card management
   - Transaction import
3. Users can skip steps and complete later
4. Progress is tracked and saved

### Adding Bank Accounts
```javascript
// Example API call
const bankAccount = await bankAccountsAPI.create({
  name: "Main Savings",
  bank_name: "Chase Bank",
  account_number: "1234",
  account_type: "savings",
  current_balance: 5000.00
});
```

### Importing Transactions
```javascript
// Example PDF import
const result = await pdfImportAPI.uploadAndProcess(file, bankAccountId);
const transactions = result.data.transactions;
await pdfImportAPI.saveTransactions(transactions, bankAccountId);
```

## Security Features

- Authentication required for all endpoints
- File upload validation (PDF only, 10MB limit)
- User-specific data isolation
- Input sanitization and validation
- Automatic file cleanup after processing

## Future Enhancements

1. **Real PDF Parsing**: Implement actual PDF text extraction
2. **AI Categorization**: Use machine learning for better transaction categorization
3. **Bank Integration**: Direct bank API connections
4. **Import Scheduling**: Automatic periodic imports
5. **Duplicate Detection**: Smart duplicate transaction handling
6. **Multi-language Support**: Internationalization for onboarding

## Dependencies

### Backend
- `multer`: File upload handling
- `bcryptjs`: Password hashing
- `express`: Web framework
- `@supabase/supabase-js`: Database client

### Frontend
- `react-router-dom`: Routing
- Custom UI components
- File upload handling

## Testing

To test the onboarding features:

1. Start the backend server: `npm run dev` (in apps/server)
2. Start the frontend: `npm run dev` (in apps/client)
3. Navigate to `/onboarding` after login
4. Test each step of the onboarding flow
5. Verify API endpoints with tools like Postman

## Notes

- PDF parsing is currently mocked - implement actual parsing logic
- File uploads are stored temporarily and cleaned up after processing
- All user data is isolated by user ID
- The onboarding flow is designed to be skippable
- Progress tracking is client-side only for now 