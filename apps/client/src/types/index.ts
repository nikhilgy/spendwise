import React from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string; // ISO string
  merchant: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string | null;
  card_id?: string | null; // Optional card reference
  bank_account_id?: string | null; // Optional bank account reference
  source: string; // e.g., 'PDF Import', 'Manual Entry', 'SMS'
  raw?: string; // Raw data if applicable
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color?: string; // Optional: for chart colors
}

export interface BankAccount {
  id: string;
  user_id: string;
  name: string;
  bank_name: string;
  account_number?: string;
  account_type: 'savings' | 'checking';
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rule {
  id: string;
  user_id: string;
  priority: number;
  match_type: 'regex' | 'keyword';
  pattern: string;
  category_id: string;
}

export interface Event {
  id: string;
  user_id: string;
  name: string;
  date_from: string; // ISO string
  date_to: string; // ISO string
  manuallyExcludedTransactionIds?: string[]; // IDs of transactions explicitly excluded from this event
}

export interface NavigationPage {
  name: string;
  path: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Changed from React.ReactNode / React.ReactElement
}

export interface EMIDetails {
  amount: number;
  tenure: number; // in months
  interestRate: number; // annual percentage
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  affordabilitySuggestion?: string;
}

// For spending tip API related types (if specific response structures are expected)
export interface SpendingTipResponse {
  tip: string;
  category?: string; // Optional category the tip might relate to
}

export interface Card {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  last_four: string;
  card_type: 'credit' | 'debit';
  billing_cycle_day?: number;
  reward_rules?: Record<string, number>; // category/merchant -> reward rate
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// PDF Import related types
export interface PDFImportResult {
  success: boolean;
  transactions: Transaction[];
  totalTransactions: number;
  fileName: string;
  processedAt: string;
}

export interface ImportHistory {
  id: string;
  user_id: string;
  file_name: string;
  total_transactions: number;
  processed_at: string;
  status: 'completed' | 'failed' | 'processing';
  bank_account_id?: string;
}