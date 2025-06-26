import React from 'react';
import { TrendingUpIcon } from '../assets';

export const EMICalculatorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <TrendingUpIcon className="w-16 h-16 text-teal mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-navy dark:text-neutral-000 mb-2">
          Analytics
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Detailed financial analytics and reports will be available here soon.
        </p>
      </div>
    </div>
  );
}; 