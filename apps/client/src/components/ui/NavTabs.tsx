import React from 'react';

type Tab = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DzenNavTabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export const DzenNavTabs: React.FC<DzenNavTabsProps> = ({ tabs, value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {tabs.map(tab => {
        const isActive = value === tab.value;
        const isDisabled = tab.disabled;
        let style = `
          font-family: var(--dzen-font-family-primary);
          font-weight: var(--dzen-font-weight-medium);
          font-size: 1rem;
          border-radius: var(--dzen-radius-sm);
          padding: 0.5em 1.25em;
          background: transparent;
          color: var(--dzen-gray700);
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        `;
        if (isActive) {
          style += `background: var(--dzen-black); color: var(--dzen-white);`;
        }
        if (!isActive && !isDisabled) {
          style += `background: transparent; color: var(--dzen-gray700);`;
        }
        if (isDisabled) {
          style += `color: var(--dzen-disabled-fg); cursor: not-allowed;`;
        }
        return (
          <button
            key={tab.value}
            style={Object.fromEntries(style.split(';').filter(Boolean).map(s => s.split(':').map(x => x.trim())).map(([k, v]) => [k, v]))}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.value)}
            onFocus={e => {
              if (!isDisabled) e.currentTarget.style.outline = `2px solid var(--dzen-focus-ring)`;
            }}
            onBlur={e => {
              if (!isDisabled) e.currentTarget.style.outline = '';
            }}
            onMouseOver={e => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.background = 'var(--dzen-gray100)';
                e.currentTarget.style.color = 'var(--dzen-gray900)';
              }
            }}
            onMouseOut={e => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--dzen-gray700)';
              }
            }}
            aria-selected={isActive}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}; 