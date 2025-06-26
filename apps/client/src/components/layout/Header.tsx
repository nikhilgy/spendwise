import React from 'react';
import { User } from '../../types';
import { MenuIcon, SearchIcon } from '../../assets';
import { DzenButton } from '../ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(0,0,0,0.80)',
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--dzen-shadow-card)',
        height: 56,
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--dzen-font-family-primary)',
      }}
    >
      <DzenButton
        variant="icon"
        onClick={onMenuClick}
        aria-label="Open sidebar"
        style={{ marginRight: 16, display: 'none' }}
      >
        <MenuIcon style={{ width: 24, height: 24 }} />
      </DzenButton>
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <SearchIcon style={{ width: 20, height: 20, color: 'var(--dzen-gray500)' }} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid transparent',
            background: 'rgba(255,255,255,0.10)',
            color: 'var(--dzen-white)',
            borderRadius: 'var(--dzen-radius-md)',
            fontSize: 16,
            fontFamily: 'var(--dzen-font-family-primary)',
            outline: 'none',
            transition: 'background 0.15s',
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 24 }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--dzen-white)', marginRight: 8 }}>{user.name}</span>
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: 32, height: 32, borderRadius: 'var(--dzen-radius-full)', objectFit: 'cover', border: '2px solid rgba(234,66,66,0.5)' }}
            />
          </div>
        )}
      </div>
    </header>
  );
}; 