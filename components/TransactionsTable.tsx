import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2025-06-01', merchant: 'Amazon', category: 'Shopping', amount: -120.5 },
  { id: '2', date: '2025-06-02', merchant: 'Starbucks', category: 'Food', amount: -8.75 },
  { id: '3', date: '2025-06-03', merchant: 'Apple', category: 'Tech', amount: -999.99 },
  { id: '4', date: '2025-06-04', merchant: 'Salary', category: 'Income', amount: 5000 },
];

const TransactionsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = mockTransactions.filter(tx =>
    tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
    tx.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="bg-neutral-000 rounded-lg shadow-card p-6">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="flex-1 px-4 py-2 border border-neutral-200 rounded-md text-sm focus:ring-1 focus:ring-teal focus:border-teal"
        />
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Merchant</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {filtered.map(tx => (
            <tr key={tx.id} className="hover:bg-neutral-100 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{tx.date}</td>
              <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{tx.merchant}</td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{tx.category}</td>
              <td className={`px-4 py-3 font-medium whitespace-nowrap text-right ${tx.amount < 0 ? 'text-error-red' : 'text-teal'}`}>{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}</td>
              <td className="px-4 py-3 text-right">
                <button className="text-neutral-400 hover:text-navy">•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable; 