import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
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

const MoneyStatisticsPanel: React.FC = () => {
  const [tab, setTab] = useState(0);
  const chartData = tab === 0 ? dataMonthly : dataWeekly;
  return (
    <div className="bg-neutral-000 rounded-lg shadow-card p-6">
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <Tab.List className="flex space-x-2 mb-4">
          <Tab className={({ selected }) => `px-4 py-1.5 rounded-md text-sm font-medium ${selected ? 'bg-teal text-neutral-000' : 'bg-neutral-100 text-navy hover:bg-neutral-200'}`}>Monthly</Tab>
          <Tab className={({ selected }) => `px-4 py-1.5 rounded-md text-sm font-medium ${selected ? 'bg-teal text-neutral-000' : 'bg-neutral-100 text-navy hover:bg-neutral-200'}`}>Weekly</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dataMonthly} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF1" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6E7380' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6E7380' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="Income" stackId="a" fill="#04102D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Investment" stackId="a" fill="#A6CDBB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" stackId="a" fill="#B8BCC6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Tab.Panel>
          <Tab.Panel>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dataWeekly} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF1" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6E7380' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6E7380' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="Income" stackId="a" fill="#04102D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Investment" stackId="a" fill="#A6CDBB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" stackId="a" fill="#B8BCC6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MoneyStatisticsPanel; 