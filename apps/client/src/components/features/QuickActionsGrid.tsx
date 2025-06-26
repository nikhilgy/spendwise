import React from 'react';
import { DzenButton } from '../ui/Button';

const actions = [
  { icon: '+', label: 'Top Up' },
  { icon: '⇄', label: 'Transfer' },
  { icon: '↓', label: 'Withdraw' },
];

const QuickActionsGrid: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    {actions.map((action) => (
      <DzenButton
        key={action.label}
        variant="icon"
        aria-label={action.label}
        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--dzen-font-family-primary)' }}
      >
        <span style={{ fontSize: 24, marginBottom: 8 }}>{action.icon}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--dzen-black)' }}>{action.label}</span>
      </DzenButton>
    ))}
  </div>
);

export default QuickActionsGrid; 