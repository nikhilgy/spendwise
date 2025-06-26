import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsListPage } from './pages/TransactionsListPage';
import { EMICalculatorPage } from './pages/EMICalculatorPage';
import { CardsPage } from './pages/CardsPage';
import { EventsPage } from './pages/EventsPage';
import { RulesPage } from './pages/RulesPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';

const App: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading, handleLogout } = useAuth();
  const { transactions, categories, events, cards, isLoading: dataLoading, error } = useData(isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <LoginPage onLogin={() => window.location.reload()} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      
      {/* Onboarding route */}
      <Route 
        path="/onboarding" 
        element={
          isAuthenticated ? (
            <OnboardingPage 
              user={user!} 
              onComplete={() => {
                // Refresh data after onboarding completion
                window.location.reload();
              }} 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            <div style={{ display: 'flex', height: '100vh', background: 'var(--dzen-offWhite)', color: 'var(--dzen-gray900)', fontFamily: 'var(--dzen-font-family-primary)' }}>
              <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={toggleSidebar} 
                onLogout={handleLogout}
                user={user}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header 
                  onMenuClick={toggleSidebar}
                  user={user}
                />
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                  {dataLoading ? (
                    <LoadingSpinner />
                  ) : error ? (
                    <div style={{ textAlign: 'center', color: 'var(--dzen-error)' }}>{error}</div>
                  ) : (
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <DashboardPage 
                            transactions={transactions} 
                            categories={categories} 
                            user={user}
                            isLoading={dataLoading}
                            error={error}
                          />
                        } 
                      />
                      <Route 
                        path="/transactions" 
                        element={
                          <TransactionsListPage 
                            transactions={transactions} 
                            categories={categories} 
                          />
                        } 
                      />
                      <Route path="/emi" element={<EMICalculatorPage />} />
                      <Route path="/cards" element={<CardsPage cards={cards} />} />
                      <Route 
                        path="/events" 
                        element={
                          <EventsPage 
                            initialEvents={events}
                            allTransactions={transactions}
                            categories={categories}
                            user={user}
                          />
                        } 
                      />
                      <Route path="/rules" element={<RulesPage />} />
                    </Routes>
                  )}
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default App; 