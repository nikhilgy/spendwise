import React from 'react';
import { Transaction, Category } from '@shared-types/index';

interface TransactionsListPageProps {
  transactions: Transaction[];
  categories: Category[];
}

export const TransactionsListPage: React.FC<TransactionsListPageProps> = ({ transactions, categories }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-neutral-000">
          Transactions
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          View and manage your transaction history
        </p>
      </div>
      
      <div className="bg-neutral-000 dark:bg-neutral-800 rounded-lg shadow-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-navy dark:text-neutral-000 mb-4">
            Transaction List ({transactions.length})
          </h2>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-050 dark:bg-neutral-700 rounded-md">
                <div>
                  <p className="font-medium text-navy dark:text-neutral-000">
                    {transaction.merchant}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {transaction.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy dark:text-neutral-000">
                    ₹{transaction.amount}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 