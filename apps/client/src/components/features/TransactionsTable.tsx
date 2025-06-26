import React, { useState } from 'react';
import { DzenButton } from '../ui/Button';

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
    <div style={{ background: 'var(--dzen-white)', borderRadius: 'var(--dzen-radius-lg)', boxShadow: 'var(--dzen-shadow-card)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions..."
          style={{
            flex: 1,
            padding: '8px 16px',
            border: '1px solid var(--dzen-gray200)',
            borderRadius: 'var(--dzen-radius-md)',
            fontSize: 14,
            fontFamily: 'var(--dzen-font-family-primary)',
            outline: 'none',
            color: 'var(--dzen-black)',
            background: 'var(--dzen-white)',
          }}
        />
      </div>
      <table style={{ width: '100%', fontSize: 14, fontFamily: 'var(--dzen-font-family-primary)', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--dzen-gray500)', textTransform: 'uppercase', borderBottom: '1px solid var(--dzen-gray200)' }}>
            <th style={{ padding: '12px 16px', fontWeight: 700 }}>Date</th>
            <th style={{ padding: '12px 16px', fontWeight: 700 }}>Merchant</th>
            <th style={{ padding: '12px 16px', fontWeight: 700 }}>Category</th>
            <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Options</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(tx => (
            <tr key={tx.id} style={{ transition: 'background 0.15s' }} onMouseOver={e => (e.currentTarget.style.background = 'var(--dzen-gray100)')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              <td style={{ padding: '12px 16px', color: 'var(--dzen-gray500)' }}>{tx.date}</td>
              <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--dzen-black)' }}>{tx.merchant}</td>
              <td style={{ padding: '12px 16px', color: 'var(--dzen-gray500)' }}>{tx.category}</td>
              <td style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right', color: tx.amount < 0 ? 'var(--dzen-error)' : 'var(--dzen-red)' }}>{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                <DzenButton variant="icon" aria-label="Options" style={{ background: 'transparent', color: 'var(--dzen-gray500)' }}>•••</DzenButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable; 