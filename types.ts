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
  source: string; // e.g., 'PDF Import', 'Manual Entry', 'SMS'
  raw?: string; // Raw data if applicable
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color?: string; // Optional: for chart colors
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