import React from 'react';

type DzenCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'generic' | 'balance';
  children: React.ReactNode;
};

export const DzenCard: React.FC<DzenCardProps> = ({ variant = 'generic', children, style, ...props }) => {
  let base =
    'font-family: var(--dzen-font-family-primary); border-radius: var(--dzen-radius-lg); box-shadow: var(--dzen-shadow-card);';
  let cardStyle = '';
  if (variant === 'generic') {
    cardStyle = `background: var(--dzen-white); border: 1px solid var(--dzen-gray200);`;
  } else if (variant === 'balance') {
    cardStyle = `
      background: radial-gradient(circle at bottom left, #D52B2B 0%, var(--dzen-red) 100%);
      color: var(--dzen-white);
      position: relative;
      overflow: hidden;
    `;
  }
  return (
    <div
      style={{ ...style, ...Object.fromEntries((base + cardStyle).split(';').filter(Boolean).map(s => s.split(':').map(x => x.trim())).map(([k, v]) => [k, v])) }}
      {...props}
    >
      {children}
    </div>
  );
}; 