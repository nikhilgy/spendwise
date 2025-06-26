import React from 'react';

const actions = [
  { icon: '+', label: 'Top Up' },
  { icon: '⇄', label: 'Transfer' },
  { icon: '↓', label: 'Withdraw' },
];

const QuickActionsGrid: React.FC = () => (
  <div className="grid grid-cols-3 gap-3">
    {actions.map((action) => (
      <button
        key={action.label}
        className="flex flex-col items-center justify-center border border-neutral-200 rounded-lg py-4 hover:bg-neutral-100 transition-colors focus:outline-none"
        aria-label={action.label}
      >
        <span className="text-2xl mb-2">{action.icon}</span>
        <span className="text-sm font-medium text-navy">{action.label}</span>
      </button>
    ))}
  </div>
);

export default QuickActionsGrid; 