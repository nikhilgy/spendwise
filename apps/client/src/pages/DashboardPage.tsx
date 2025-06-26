import React from 'react';
import { Transaction, Category, User } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DzenCard } from '../components/ui/Card';

interface DashboardPageProps {
  transactions: Transaction[];
  categories: Category[];
  user: User | null;
  isLoading?: boolean;
  error?: string | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, categories, user, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div style={{ textAlign: 'center', color: 'var(--dzen-error)' }}>{error}</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--dzen-black)', fontFamily: 'var(--dzen-font-family-primary)' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--dzen-gray500)', fontFamily: 'var(--dzen-font-family-primary)' }}>
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        <DzenCard>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dzen-black)', marginBottom: 8 }}>Total Transactions</h3>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--dzen-red)' }}>{transactions.length}</p>
          {transactions.length === 0 && <p style={{ fontSize: 14, color: 'var(--dzen-gray500)', marginTop: 8 }}>No transactions found.</p>}
        </DzenCard>
        <DzenCard>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dzen-black)', marginBottom: 8 }}>Categories</h3>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--dzen-red)' }}>{categories.length}</p>
          {categories.length === 0 && <p style={{ fontSize: 14, color: 'var(--dzen-gray500)', marginTop: 8 }}>No categories found.</p>}
        </DzenCard>
      </div>
    </div>
  );
}; 