import React from 'react';
import { DzenCard } from '../ui/Card';

const CardBalanceWidget: React.FC = () => {
  const balance = 120000;
  const limit = 135000;
  return (
    <DzenCard variant="balance" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--dzen-white)', marginBottom: 8, fontFamily: 'var(--dzen-font-family-primary)' }}>
        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--dzen-radius-full)', marginBottom: 8 }}>
        <div style={{ height: 4, background: 'var(--dzen-white)', borderRadius: 'var(--dzen-radius-full)', width: `${(balance / limit) * 100}%` }} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--dzen-white)' }}>
        Monthly payment limit: <span style={{ fontWeight: 700, color: 'var(--dzen-white)' }}>${limit.toLocaleString()}</span>
      </div>
    </DzenCard>
  );
};

export default CardBalanceWidget; 