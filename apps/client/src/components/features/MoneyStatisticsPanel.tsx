import React, { useState } from 'react';
import { DzenNavTabs } from '../ui/NavTabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dataMonthly = [
  { month: 'Jan', Income: 12000, Investment: 4000, Expense: 8000 },
  { month: 'Feb', Income: 15000, Investment: 5000, Expense: 9000 },
  { month: 'Mar', Income: 17000, Investment: 6000, Expense: 11000 },
  { month: 'Apr', Income: 14000, Investment: 4000, Expense: 10000 },
  { month: 'May', Income: 18000, Investment: 7000, Expense: 12000 },
  { month: 'Jun', Income: 16000, Investment: 6000, Expense: 11000 },
];
const dataWeekly = [
  { week: 'W1', Income: 3000, Investment: 1000, Expense: 2000 },
  { week: 'W2', Income: 3500, Investment: 1200, Expense: 2300 },
  { week: 'W3', Income: 4000, Investment: 1500, Expense: 2500 },
  { week: 'W4', Income: 3200, Investment: 1100, Expense: 2100 },
];

const tabs = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
];

const MoneyStatisticsPanel: React.FC = () => {
  const [tab, setTab] = useState('monthly');
  const chartData = tab === 'monthly' ? dataMonthly : dataWeekly;
  return (
    <div style={{ background: 'var(--dzen-white)', borderRadius: 'var(--dzen-radius-lg)', boxShadow: 'var(--dzen-shadow-card)', padding: 24 }}>
      <DzenNavTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dzen-gray200)" />
            <XAxis dataKey={tab === 'monthly' ? 'month' : 'week'} tick={{ fontSize: 12, fill: 'var(--dzen-gray500)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--dzen-gray500)' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="Income" stackId="a" fill="var(--dzen-black)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Investment" stackId="a" fill="var(--dzen-red)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" stackId="a" fill="var(--dzen-gray500)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoneyStatisticsPanel; 