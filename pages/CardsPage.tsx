import React from 'react';
import CardCarousel from '../components/CardCarousel';
import CardBalanceWidget from '../components/CardBalanceWidget';
import QuickActionsGrid from '../components/QuickActionsGrid';
import MoneyStatisticsPanel from '../components/MoneyStatisticsPanel';
import TransactionsTable from '../components/TransactionsTable';

const CardsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-neutral-050">
      <main className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <CardCarousel />
          <CardBalanceWidget />
          <QuickActionsGrid />
        </div>
        <div className="lg:col-span-3 space-y-8">
          <MoneyStatisticsPanel />
          <TransactionsTable />
        </div>
      </main>
      {/* Floating new payment button */}
      <button className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-teal text-neutral-000 flex items-center justify-center shadow-lg text-3xl">+</button>
    </div>
  );
};

export default CardsPage; 