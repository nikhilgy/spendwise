import { validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation rules
export const commonValidations = {
  // User validations
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Please provide a valid email address'
    },
    normalizeEmail: true
  },
  
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  },
  
  name: {
    in: ['body'],
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Name must be between 2 and 50 characters'
    },
    trim: true
  },
  
  // Transaction validations
  amount: {
    in: ['body'],
    isFloat: {
      options: { min: 0.01 },
      errorMessage: 'Amount must be a positive number'
    },
    toFloat: true
  },
  
  merchant: {
    in: ['body'],
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Merchant name must be between 1 and 100 characters'
    },
    trim: true
  },
  
  transactionType: {
    in: ['body'],
    isIn: {
      options: [['income', 'expense']],
      errorMessage: 'Transaction type must be either "income" or "expense"'
    }
  },
  
  date: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'Date must be a valid ISO 8601 date string'
    }
  },
  
  // Category validations
  categoryName: {
    in: ['body'],
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: 'Category name must be between 1 and 50 characters'
    },
    trim: true
  },
  
  color: {
    in: ['body'],
    optional: true,
    isHexColor: {
      errorMessage: 'Color must be a valid hex color code'
    }
  },
  
  // Event validations
  eventName: {
    in: ['body'],
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Event name must be between 1 and 100 characters'
    },
    trim: true
  },
  
  dateFrom: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'Start date must be a valid ISO 8601 date string'
    }
  },
  
  dateTo: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'End date must be a valid ISO 8601 date string'
    },
    custom: {
      options: (value, { req }) => {
        if (new Date(value) <= new Date(req.body.date_from)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }
    }
  }
}; 