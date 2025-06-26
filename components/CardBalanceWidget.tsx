import React from 'react';

const CardBalanceWidget: React.FC = () => {
  const balance = 120000;
  const limit = 135000;
  return (
    <div className="bg-neutral-000 rounded-lg shadow-card p-6 flex flex-col items-start">
      <div className="text-4xl font-semibold text-navy mb-2">${balance.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
      <div className="w-full h-1 bg-neutral-200 rounded-pill mb-2">
        <div className="h-1 bg-teal rounded-pill" style={{width: `${(balance/limit)*100}%`}} />
      </div>
      <div className="text-xs text-neutral-500">Monthly payment limit: <span className="font-semibold text-navy">${limit.toLocaleString()}</span></div>
    </div>
  );
};

export default CardBalanceWidget; 