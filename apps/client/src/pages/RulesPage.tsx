import React from 'react';
import { CogIcon } from '../assets';

export const RulesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CogIcon className="w-16 h-16 text-teal mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-navy dark:text-neutral-000 mb-2">
          Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your application settings and preferences here.
        </p>
      </div>
    </div>
  );
}; 