import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types';
import {
  HomeIcon, CreditCardIcon, CalculatorIcon, CalendarIcon, CogIcon,
  LightBulbIcon, XIcon, SunIcon, MoonIcon, LogoutIcon
} from '../../assets';
import { DzenButton } from '../ui/Button';

interface NavigationPage {
  name: string;
  path: string;
  icon: React.ReactElement;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout, user }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const navigationItems: NavigationPage[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon style={{ color: 'var(--dzen-black)' }} /> },
    { name: 'Payments', path: '/transactions', icon: <CreditCardIcon style={{ color: 'var(--dzen-black)' }} /> },
    { name: 'Analytics', path: '/emi', icon: <CalculatorIcon style={{ color: 'var(--dzen-black)' }} /> },
    { name: 'Cards', path: '/cards', icon: <CreditCardIcon style={{ color: 'var(--dzen-black)' }} /> },
    { name: 'Events', path: '/events', icon: <CalendarIcon style={{ color: 'var(--dzen-black)' }} /> },
    { name: 'Settings', path: '/rules', icon: <CogIcon style={{ color: 'var(--dzen-black)' }} /> },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        inset: '0 0 0 0',
        zIndex: 40,
        width: 256,
        background: 'var(--dzen-black)',
        color: 'var(--dzen-white)',
        padding: 24,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s',
        fontFamily: 'var(--dzen-font-family-primary)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: 'var(--dzen-red)', padding: 8, borderRadius: 'var(--dzen-radius-md)', marginRight: 12 }}>
            <LightBulbIcon style={{ width: 24, height: 24, color: 'var(--dzen-white)' }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dzen-white)' }}>SpendWise</h1>
        </div>
        <DzenButton variant="icon" onClick={onToggle} aria-label="Close sidebar" style={{ display: 'none' }}>
          <XIcon style={{ width: 24, height: 24 }} />
        </DzenButton>
      </div>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
            return (
              <li key={item.path} style={{ marginBottom: 8 }}>
                <Link
                  to={item.path}
                  onClick={onToggle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: 'var(--dzen-radius-full)',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: isActive ? 'var(--dzen-white)' : 'var(--dzen-gray500)',
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {React.cloneElement(item.icon, { style: { width: 20, height: 20, color: isActive ? 'var(--dzen-white)' : 'var(--dzen-gray500)', marginRight: 12 } })}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <DzenButton
          variant="secondary"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          style={{ width: '100%', marginBottom: 8, justifyContent: 'flex-start' }}
        >
          {isDarkMode ? <SunIcon style={{ width: 20, height: 20, marginRight: 12, color: 'var(--dzen-red)' }} /> : <MoonIcon style={{ width: 20, height: 20, marginRight: 12, color: 'var(--dzen-red)' }} />} Toggle Theme
        </DzenButton>
        {user && (
          <DzenButton
            variant="secondary"
            onClick={onLogout}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogoutIcon style={{ width: 20, height: 20, marginRight: 12, color: 'var(--dzen-red)' }} /> Logout
          </DzenButton>
        )}
      </div>
    </aside>
  );
};
