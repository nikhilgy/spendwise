import React from 'react';

type DzenButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'icon';
  children: React.ReactNode;
};

export const DzenButton = React.forwardRef<HTMLButtonElement, DzenButtonProps>(
  ({ variant = 'primary', disabled, children, ...props }, ref) => {
    let base =
      'font-family: var(--dzen-font-family-primary); font-weight: var(--dzen-font-weight-medium); border: none; outline: none; transition: all 0.15s; cursor: pointer;';
    let style = '';
    if (variant === 'primary') {
      style = `
        background: linear-gradient(135deg, var(--dzen-red) 0%, #C63939 100%);
        color: var(--dzen-white);
        border-radius: var(--dzen-radius-sm);
        box-shadow: var(--dzen-shadow-card);
        padding: 0.75em 1.5em;
      `;
      if (disabled) {
        style += `background: var(--dzen-disabled-bg); color: var(--dzen-disabled-fg); cursor: not-allowed; box-shadow: none;`;
      }
    } else if (variant === 'secondary') {
      style = `
        background: transparent;
        border: 1px solid var(--dzen-gray300);
        color: var(--dzen-black);
        border-radius: var(--dzen-radius-sm);
        padding: 0.75em 1.5em;
      `;
      if (disabled) {
        style += `color: var(--dzen-disabled-fg); border-color: var(--dzen-disabled-bg); cursor: not-allowed;`;
      }
    } else if (variant === 'icon') {
      style = `
        width: 40px; height: 40px;
        background: var(--dzen-gray100);
        color: var(--dzen-black);
        border-radius: var(--dzen-radius-full);
        display: flex; align-items: center; justify-content: center;
        padding: 0;
      `;
      if (disabled) {
        style += `background: var(--dzen-disabled-bg); color: var(--dzen-disabled-fg); cursor: not-allowed;`;
      }
    }
    return (
      <button
        ref={ref}
        style={{ ...props.style, ...Object.fromEntries((base + style).split(';').filter(Boolean).map(s => s.split(':').map(x => x.trim())).map(([k, v]) => [k, v])) }}
        disabled={disabled}
        {...props}
        onMouseDown={e => {
          if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
          props.onMouseDown?.(e);
        }}
        onMouseUp={e => {
          if (!disabled) e.currentTarget.style.transform = '';
          props.onMouseUp?.(e);
        }}
        onFocus={e => {
          if (!disabled) e.currentTarget.style.outline = `2px solid var(--dzen-focus-ring)`;
          props.onFocus?.(e);
        }}
        onBlur={e => {
          if (!disabled) e.currentTarget.style.outline = '';
          props.onBlur?.(e);
        }}
        onMouseOver={e => {
          if (!disabled) {
            if (variant === 'primary') e.currentTarget.style.boxShadow = 'var(--dzen-shadow-hover)';
            if (variant === 'secondary') e.currentTarget.style.background = 'var(--dzen-gray100)';
            if (variant === 'icon') e.currentTarget.style.background = 'var(--dzen-gray200)';
          }
          props.onMouseOver?.(e);
        }}
        onMouseOut={e => {
          if (!disabled) {
            if (variant === 'primary') e.currentTarget.style.boxShadow = 'var(--dzen-shadow-card)';
            if (variant === 'secondary') e.currentTarget.style.background = 'transparent';
            if (variant === 'icon') e.currentTarget.style.background = 'var(--dzen-gray100)';
          }
          props.onMouseOut?.(e);
        }}
      >
        {children}
      </button>
    );
  }
);

DzenButton.displayName = 'DzenButton'; 