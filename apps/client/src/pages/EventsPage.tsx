import React from 'react';
import { Transaction, Category, User, Event } from '@shared-types/index';

interface EventsPageProps {
  initialEvents: Event[];
  allTransactions: Transaction[];
  categories: Category[];
  user: User;
}

export const EventsPage: React.FC<EventsPageProps> = ({ initialEvents, allTransactions, categories, user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-neutral-000">
          Events
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your financial events and track spending patterns
        </p>
      </div>
      
      <div className="bg-neutral-000 dark:bg-neutral-800 rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-neutral-000 mb-4">
          Events ({initialEvents.length})
        </h2>
        <div className="space-y-2">
          {initialEvents.map((event) => (
            <div key={event.id} className="p-3 bg-neutral-050 dark:bg-neutral-700 rounded-md">
              <p className="font-medium text-navy dark:text-neutral-000">
                {event.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {event.date_from} to {event.date_to}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 