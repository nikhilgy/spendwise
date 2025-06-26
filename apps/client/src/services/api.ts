import { Transaction, Category, Event, EMIDetails, EMIResult, SpendingTipResponse, Card, BankAccount, PDFImportResult, ImportHistory } from '../types';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/';
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Helper function for file uploads
const uploadFile = async (endpoint: string, file: File, additionalData?: Record<string, string>) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const formData = new FormData();
  formData.append('pdfFile', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
        throw new Error('Authentication required');
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { full_name: string; email: string; password: string }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// Bank Accounts API calls
export const bankAccountsAPI = {
  getAll: async (params?: {
    account_type?: string;
    is_active?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const endpoint = `/bank-accounts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  getById: async (id: string) => {
    return apiCall(`/bank-accounts/${id}`);
  },

  create: async (bankAccount: Omit<BankAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return apiCall('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(bankAccount),
    });
  },

  update: async (id: string, bankAccount: Partial<BankAccount>) => {
    return apiCall(`/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bankAccount),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/bank-accounts/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiCall('/bank-accounts/stats');
  },

  updateBalance: async (id: string, balance: number) => {
    return apiCall(`/bank-accounts/${id}/balance`, {
      method: 'PATCH',
      body: JSON.stringify({ balance }),
    });
  },
};

// PDF Import API calls
export const pdfImportAPI = {
  uploadAndProcess: async (file: File, bankAccountId?: string) => {
    const additionalData = bankAccountId ? { bank_account_id: bankAccountId } : undefined;
    return uploadFile('/pdf-import/upload', file, additionalData);
  },

  validateFile: async (file: File) => {
    return uploadFile('/pdf-import/validate', file);
  },

  extractTransactions: async (transactions: any[]) => {
    return apiCall('/pdf-import/extract', {
      method: 'POST',
      body: JSON.stringify({ transactions }),
    });
  },

  saveTransactions: async (transactions: any[], bankAccountId?: string) => {
    return apiCall('/pdf-import/save', {
      method: 'POST',
      body: JSON.stringify({ transactions, bank_account_id: bankAccountId }),
    });
  },

  getImportHistory: async (params?: {
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const endpoint = `/pdf-import/history${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },
};

// Transactions API calls
export const transactionsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    category_id?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const endpoint = `/transactions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  getById: async (id: string) => {
    return apiCall(`/transactions/${id}`);
  },

  create: async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    return apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  update: async (id: string, transaction: Partial<Transaction>) => {
    return apiCall(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiCall('/transactions/stats');
  },

  getRecent: async (limit: number = 5) => {
    return apiCall(`/transactions/recent?limit=${limit}`);
  },

  // Import functionality
  import: async (transactions: any[], source: string, categoryMapping?: any[]) => {
    return apiCall('/transactions/import', {
      method: 'POST',
      body: JSON.stringify({ transactions, source, categoryMapping }),
    });
  },

  parseCSV: async (csvData: string) => {
    return apiCall('/transactions/parse-csv', {
      method: 'POST',
      body: JSON.stringify({ csvData }),
    });
  },
};

// Cards API calls
export const cardsAPI = {
  getAll: async (params?: {
    card_type?: string;
    is_active?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const endpoint = `/cards${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiCall(endpoint);
  },

  getById: async (id: string) => {
    return apiCall(`/cards/${id}`);
  },

  create: async (card: Omit<Card, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return apiCall('/cards', {
      method: 'POST',
      body: JSON.stringify(card),
    });
  },

  update: async (id: string, card: Partial<Card>) => {
    return apiCall(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(card),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/cards/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiCall('/cards/stats');
  },

  getSuggestion: async (merchant: string, category?: string, amount?: number) => {
    return apiCall('/cards/suggest', {
      method: 'POST',
      body: JSON.stringify({ merchant, category, amount }),
    });
  },
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => {
    return apiCall('/categories');
  },

  getById: async (id: string) => {
    return apiCall(`/categories/${id}`);
  },

  create: async (category: Omit<Category, 'id' | 'user_id'>) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (id: string, category: Partial<Category>) => {
    return apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// MOCK DATA (fallback)
const mockCategories: Category[] = [
  { id: 'cat1', user_id: '1', name: 'Groceries', color: '#FF6384' },
  { id: 'cat2', user_id: '1', name: 'Utilities', color: '#36A2EB' },
  { id: 'cat3', user_id: '1', name: 'Transport', color: '#FFCE56' },
  { id: 'cat4', user_id: '1', name: 'Entertainment', color: '#4BC0C0' },
  { id: 'cat5', user_id: '1', name: 'Salary', color: '#9966FF' },
  { id: 'cat6', user_id: '1', name: 'Healthcare', color: '#FF9F40' },
];

const mockTransactions: Transaction[] = [
  { id: 'txn1', user_id: '1', date: '2024-07-01T10:00:00Z', merchant: 'Big Bazaar', amount: 2500.50, type: 'expense', category_id: 'cat1', source: 'PDF Import' },
  { id: 'txn2', user_id: '1', date: '2024-07-01T12:30:00Z', merchant: 'Electricity Board', amount: 1200.00, type: 'expense', category_id: 'cat2', source: 'Manual' },
  { id: 'txn3', user_id: '1', date: '2024-07-02T08:15:00Z', merchant: 'Ola Cabs', amount: 350.00, type: 'expense', category_id: 'cat3', source: 'SMS' },
  { id: 'txn4', user_id: '1', date: '2024-07-03T19:00:00Z', merchant: 'PVR Cinemas', amount: 750.00, type: 'expense', category_id: 'cat4', source: 'PDF Import' },
  { id: 'txn5', user_id: '1', date: '2024-07-05T09:00:00Z', merchant: 'My Company Inc.', amount: 75000.00, type: 'income', category_id: 'cat5', source: 'Bank Statement' },
  { id: 'txn6', user_id: '1', date: '2024-07-06T14:00:00Z', merchant: 'Apollo Pharmacy', amount: 450.75, type: 'expense', category_id: 'cat6', source: 'Manual' },
  { id: 'txn7', user_id: '1', date: '2024-07-08T11:00:00Z', merchant: 'Reliance Fresh', amount: 1800.20, type: 'expense', category_id: 'cat1', source: 'SMS' },
  { id: 'txn8', user_id: '1', date: '2024-07-15T10:00:00Z', merchant: 'Weekend Getaway Cafe', amount: 3200.00, type: 'expense', category_id: 'cat4', source: 'Manual' },
  { id: 'txn9', user_id: '1', date: '2024-07-16T15:00:00Z', merchant: 'Adventure Park Tickets', amount: 2000.00, type: 'expense', category_id: 'cat4', source: 'Manual' },
];

const mockEvents: Event[] = [
  {
    id: 'evt1',
    user_id: '1',
    name: 'July Weekend Trip',
    date_from: '2024-07-13T00:00:00Z',
    date_to: '2024-07-16T23:59:59Z',
    manuallyExcludedTransactionIds: []
  },
  {
    id: 'evt2',
    user_id: '1',
    name: 'Monthly Subscriptions Review',
    date_from: '2024-07-01T00:00:00Z',
    date_to: '2024-07-31T23:59:59Z',
    manuallyExcludedTransactionIds: ['txn2'] // Example: Electricity bill excluded
  }
];

const mockCards: Card[] = [
  {
    id: 'card1',
    user_id: '1',
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    last_four: '5678',
    card_type: 'credit',
    billing_cycle_day: 15,
    reward_rules: {
      'dining': 3,
      'drugstores': 3,
      'travel': 5,
      'everything': 1.5
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'card2',
    user_id: '1',
    name: 'Amex Gold',
    issuer: 'American Express',
    last_four: '1234',
    card_type: 'credit',
    billing_cycle_day: 20,
    reward_rules: {
      'dining': 4,
      'groceries': 4,
      'airfare': 3,
      'everything': 1
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Enhanced service functions with API fallback
export const fetchMockTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await transactionsAPI.getAll();
    return response.transactions || [];
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockTransactions]), 500);
    });
  }
};

export const fetchMockCategories = async (): Promise<Category[]> => {
  try {
    const response = await categoriesAPI.getAll();
    return response.categories || [];
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCategories]), 300);
    });
  }
};

export const fetchMockEvents = async (): Promise<Event[]> => {
  // Events are still mock for now
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockEvents]), 400);
  });
};

export const fetchMockCards = async (): Promise<Card[]> => {
  try {
    const response = await cardsAPI.getAll();
    return response.cards || [];
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockCards]), 300);
    });
  }
};

// Import transactions function
export const importTransactions = async (transactions: any[], source: string, categoryMapping?: any[]) => {
  try {
    const response = await transactionsAPI.import(transactions, source, categoryMapping);
    return response;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

// Parse CSV function
export const parseCSVTransactions = async (csvData: string) => {
  try {
    const response = await transactionsAPI.parseCSV(csvData);
    return response;
  } catch (error) {
    console.error('CSV parsing failed:', error);
    throw error;
  }
};

export const calculateMockEMI = (details: EMIDetails): EMIResult => {
  const principal = details.amount;
  const annualRate = details.interestRate / 100;
  const monthlyRate = annualRate / 12;
  const tenureMonths = details.tenure;

  if (principal <= 0 || tenureMonths <= 0 || annualRate < 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalAmount: 0, affordabilitySuggestion: "Invalid input." };
  }
  
  let monthlyEMI: number;
  if (monthlyRate === 0) { // Interest-free loan
    monthlyEMI = principal / tenureMonths;
  } else {
    monthlyEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }
  
  const totalAmount = monthlyEMI * tenureMonths;
  const totalInterest = totalAmount - principal;

  let affordabilitySuggestion = "Consider your monthly budget before committing.";
  if (monthlyEMI > principal * 0.05) { // Arbitrary suggestion threshold
      affordabilitySuggestion = "This EMI seems high relative to the loan amount. Ensure it fits your monthly budget. Perhaps consider a longer tenure or a smaller loan."
  } else if (monthlyEMI < principal * 0.02) {
      affordabilitySuggestion = "This EMI seems manageable. Good planning!"
  }

  return {
    monthlyEMI,
    totalInterest,
    totalAmount,
    affordabilitySuggestion
  };
};

// SPENDING TIP SERVICE
export const getSpendingTip = async (): Promise<SpendingTipResponse> => {
  // Fallback tips when no external API is available
  const fallbackTips = [
    "Track your expenses for a week to see where your money goes.",
    "Try a 'no-spend' weekend challenge.",
    "Review your subscriptions and cancel unused ones.",
    "Set clear financial goals, like saving for a down payment or vacation.",
    "Automate your savings by setting up regular transfers to a savings account.",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
    "Cook meals at home instead of eating out to save money.",
    "Shop with a list to avoid impulse purchases.",
    "Compare prices before making big purchases.",
    "Set up an emergency fund with 3-6 months of expenses."
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ tip: fallbackTips[Math.floor(Math.random() * fallbackTips.length)] });
    }, 300);
  });
};