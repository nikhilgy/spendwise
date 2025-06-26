import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Transaction, Category, User, Event, NavigationPage, EMIDetails, EMIResult } from './types';
import { fetchMockTransactions, fetchMockCategories, fetchMockEvents, calculateMockEMI, authAPI } from './services';
import { Modal, LoadingSpinner, PieChartComponent, ImportModalContent, SpendingTip } from './components';
import { 
  SunIcon, MoonIcon, MenuIcon, XIcon, HomeIcon, CalculatorIcon, CogIcon, CalendarIcon, UploadIcon, 
  LogoutIcon, LoginIcon, LightBulbIcon, DocumentTextIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon,
  ExclamationTriangleIcon, CheckCircleIcon, CurrencyRupeeIcon, TrendingUpIcon, TrendingDownIcon, ScaleIcon,
  SearchIcon, ArrowSmRightIcon, CreditCardIcon, RefreshIcon
} from './assets';
import CardsPage from './pages/CardsPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      // For demo purposes, we'll use a mock login
      // In production, this would redirect to Google OAuth
      setUser({ 
        id: '1', 
        email: 'gabby.k@example.com', 
        name: 'Gabby K.', 
        avatarUrl: `https://avatar.vercel.sh/gabby.png` 
      });
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'demo-token');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    authAPI.googleAuth();
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [transData, catData, eventData] = await Promise.all([
            fetchMockTransactions(),
            fetchMockCategories(),
            fetchMockEvents(),
          ]);
          setTransactions(transData);
          setCategories(catData);
          setEvents(eventData);
        } catch (err) {
          setError('Failed to load data. Please try again later.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setTransactions([]);
      setCategories([]);
      setEvents([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const navigationItems: NavigationPage[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Payments', path: '/transactions', icon: <CreditCardIcon className="w-5 h-5" /> },
    { name: 'Analytics', path: '/emi', icon: <CalculatorIcon className="w-5 h-5" /> },
    { name: 'Cards', path: '/cards', icon: <CreditCardIcon className="w-5 h-5" /> },
    { name: 'Events', path: '/events', icon: <CalendarIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/rules', icon: <CogIcon className="w-5 h-5" /> },
  ];

  const NavLinkContent: React.FC<{ item: NavigationPage, isActive: boolean }> = ({ item, isActive }) => (
    <>
      {React.cloneElement(item.icon, { className: `w-5 h-5 transition-colors duration-200 ${isActive ? 'text-neutral-000' : 'text-neutral-400 group-hover:text-neutral-000'}` })}
      <span className={`ml-3 transition-colors duration-200 ${isActive ? 'text-neutral-000 font-medium' : 'text-neutral-400 group-hover:text-neutral-000'}`}>{item.name}</span>
    </>
  );
  
  const Sidebar: React.FC = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-neutral-000 p-6 transform ${isSidebarOpen ? 'translate-x-0 shadow-popover' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
            <div className="bg-teal p-2 rounded-md mr-3">
              <LightBulbIcon className="w-6 h-6 text-neutral-000" />
            </div>
            <h1 className="text-xl font-semibold text-neutral-000">SpendWise</h1>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-neutral-400 hover:text-neutral-000">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav>
        <ul>
          {navigationItems.map((item) => {
             const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
             return (
                <li key={item.path} className="mb-1">
                <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`group flex items-center px-4 py-2 rounded-full transition-all duration-200 ease-in-out relative ${
                    isActive
                        ? 'bg-white/10 text-neutral-000 font-semibold shadow-none'
                        : 'hover:bg-white/5 text-neutral-300 hover:text-neutral-000'
                    }`}
                >
                    <NavLinkContent item={item} isActive={isActive} />
                </Link>
                </li>
            );
        })}
        </ul>
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
         <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-start text-sm text-neutral-400 hover:text-neutral-000 p-3 rounded-md hover:bg-neutral-000/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon className="w-5 h-5 mr-3 text-teal" /> : <MoonIcon className="w-5 h-5 mr-3 text-teal" />} Toggle Theme
          </button>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center text-sm text-neutral-400 hover:text-neutral-000 p-3 rounded-md hover:bg-neutral-000/10 transition-colors"
          >
            <LogoutIcon className="w-5 h-5 mr-3 text-teal"/> Logout
          </button>
        )}
      </div>
    </aside>
  );

  const Header: React.FC = () => (
    <header className="sticky top-0 z-30 bg-navy/80 backdrop-blur-md shadow-card h-14 px-6 md:px-8">
      <div className="w-full h-full mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="md:hidden text-neutral-400 hover:text-neutral-000 mr-4 p-1 rounded-full hover:bg-neutral-000/10">
            <MenuIcon className="w-6 h-6" />
          </button>
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full sm:w-64 md:w-80 pl-10 pr-3 py-2.5 border border-transparent bg-neutral-000/10 text-neutral-000 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal focus:bg-neutral-000/20 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-000 hidden sm:inline">{user.name}</span>
              <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-teal/50" />
            </div>
          )}
          {!isAuthenticated && (
             <button
              onClick={handleLogin}
              className="flex items-center bg-teal hover:bg-teal/80 text-neutral-000 font-medium py-2 px-4 rounded-md shadow-sm transition-all text-sm"
            >
              <LoginIcon className="w-4 h-4 mr-1.5"/> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-050 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-000 rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <div className="bg-teal p-3 rounded-lg inline-block mb-4">
              <LightBulbIcon className="w-8 h-8 text-neutral-000" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-2">Welcome to SpendWise</h1>
            <p className="text-neutral-500">Track your spending and manage your finances with ease.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-navy font-medium py-3 px-4 rounded-md shadow-sm border border-gray-300 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-teal hover:bg-teal/80 text-neutral-000 font-medium py-3 px-4 rounded-md shadow-sm transition-all"
            >
              <LoginIcon className="w-5 h-5 inline mr-2"/> Demo Login
            </button>
          </div>
          
          <p className="text-xs text-neutral-400 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-050 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-neutral-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-050 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-000 rounded-lg shadow-card p-6 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-error-red mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-navy mb-2">Something went wrong</h2>
          <p className="text-neutral-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal hover:bg-teal/80 text-neutral-000 font-medium py-2 px-4 rounded-md shadow-sm transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-050">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage transactions={transactions} categories={categories} user={user} onImportClick={() => setShowImportModal(true)} />} />
            <Route path="/transactions" element={<TransactionsListPage transactions={transactions} categories={categories} />} />
            <Route path="/emi" element={<EMICalculatorPage />} />
            <Route path="/events" element={<EventsPage initialEvents={events} allTransactions={transactions} categories={categories} user={user!} />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/cards" element={<CardsPage />} />
          </Routes>
        </main>
      </div>
      
      {showImportModal && (
        <Modal title="Import Transactions" onClose={() => setShowImportModal(false)}>
          <ImportModalContent onClose={() => setShowImportModal(false)} />
        </Modal>
      )}
    </div>
  );
};

const DashboardPage: React.FC<{ transactions: Transaction[], categories: Category[], user: User | null, onImportClick: () => void }> = ({ transactions, categories, user, onImportClick }) => {
  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const spendingByCat: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const categoryName = categories.find(c => c.id === t.category_id)?.name || 'Uncat.';
      spendingByCat[categoryName] = (spendingByCat[categoryName] || 0) + t.amount;
    });
    return Object.entries(spendingByCat).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-navy">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!</h2>
        <p className="text-sm text-neutral-500">long time no see</p>
      </div>

      {/* Overview Section */}
      <h3 className="text-lg font-semibold text-navy mb-3">Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <SummaryCard title="Balance" value={`₹${summary.balance.toFixed(2)}`} icon={<ScaleIcon />} trend="+12%" trendColor="text-success-green" iconBg="bg-teal/10" iconColor="text-teal" />
        <SummaryCard title="Income" value={`₹${summary.totalIncome.toFixed(2)}`} icon={<TrendingUpIcon />} trend="+4%" trendColor="text-success-green" iconBg="bg-mint" iconColor="text-success-green" />
        <SummaryCard title="Expenses" value={`₹${summary.totalExpense.toFixed(2)}`} icon={<TrendingDownIcon />} trend="-2%" trendColor="text-error-red" iconBg="bg-error-red/10" iconColor="text-error-red" />
      </div>

      {/* Analytics & Actions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
        {/* Analytics Bar Chart Area */}
        <div className="lg:col-span-2 bg-neutral-000 p-5 rounded-lg shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-navy">Analytics</h3>
            {/* Time period selectors */}
            <div className="flex space-x-1">
              {['Week', 'Month', '6 Months', 'Year'].map((period, idx) => (
                <button key={period} className={`px-3 py-1.5 text-xs rounded-md ${idx === 2 ? 'bg-teal text-neutral-000' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-neutral-500 mb-1">Expected Income</p>
          <p className="text-2xl font-bold text-navy mb-4">₹1753</p>
          {categoryData.length > 0 ? (
            <div className="h-64 md:h-72">
               <PieChartComponent data={categoryData} chartType="bar" />
            </div>
          ) : <p className="text-center py-10 text-neutral-500">No expense data for chart.</p>}
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-5">
            <h3 className="text-lg font-semibold text-navy">Action</h3>
            <ActionButton icon={<ArrowSmRightIcon />} title="Transfer" bgColor="bg-neutral-000" />
            <ActionButton icon={<RefreshIcon />} title="Receive" bgColor="bg-neutral-000" />
             <div className="bg-neutral-000 p-5 rounded-lg shadow-card">
                <h3 className="text-sm font-medium text-navy mb-1">Expenses in May</h3>
                <p className="text-2xl font-bold text-teal mb-2">₹1262.22</p>
                {/* Progress bar */}
                <div className="h-2 w-full bg-neutral-200 rounded-pill overflow-hidden">
                    <div className="h-2 bg-teal rounded-pill" style={{width: '60%'}}></div>
                </div>
             </div>
             <button 
                 onClick={onImportClick}
                 className="w-full flex items-center justify-center bg-neutral-000 hover:bg-neutral-100 text-navy font-medium py-3 px-4 rounded-md shadow-card transition-colors"
               >
                 <UploadIcon className="w-5 h-5 mr-2 text-teal" /> Import Transactions
            </button>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-neutral-000 p-5 rounded-lg shadow-card mt-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Transactions</h3>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-200 bg-neutral-050">
                <tr>
                  <th scope="col" className="px-3 py-3 font-medium">Period</th>
                  <th scope="col" className="px-3 py-3 font-medium text-right">Card or account</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-100 transition-colors">
                    <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs font-medium mr-3">{t.merchant.substring(0,1)}</div>
                            <div>
                                <div className="font-medium text-navy">{t.merchant}</div>
                                <div className="text-xs text-neutral-500">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - Payment for goods</div>
                            </div>
                        </div>
                    </td>
                    <td className={`px-3 py-4 font-medium whitespace-nowrap text-right ${t.type === 'expense' ? 'text-error-red' : 'text-navy'}`}>
                      {t.type === 'expense' ? '-' : '+'}₹{t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="text-center py-10">
                <DocumentTextIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-500">No transactions yet. Import some!</p>
            </div>}
      </div>
    </div>
  );
};

interface SummaryCardProps { title: string; value: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; trend?: string; trendColor?: string; iconBg?: string; iconColor?: string; }
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend, trendColor, iconBg, iconColor }) => (
  <div className="bg-neutral-000 p-6 rounded-lg shadow-card flex flex-col justify-between min-h-[180px]">
    <div className="flex items-start justify-between">
        <div className={`p-2 rounded-md ${iconBg || 'bg-teal/10'}`}>
         {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor || 'text-teal'}` })}
        </div>
        {/* Three dots menu */}
        <button className="text-neutral-400 hover:text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
        </button>
    </div>
    <div>
      <h4 className="text-sm font-normal text-neutral-500 mb-1">{title}</h4>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-navy">{value}</p>
        {trend && <span className={`text-xs font-medium px-2 py-1 rounded-pill ${trendColor === 'text-success-green' ? 'bg-mint text-success-green' : 'bg-error-red/10 text-error-red'}`}>{trend}</span>}
      </div>
    </div>
  </div>
);

interface ActionButtonProps { icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; title: string; bgColor?: string; }
const ActionButton: React.FC<ActionButtonProps> = ({ icon, title, bgColor }) => (
  <button className={`w-full flex items-center p-3 rounded-md shadow-card transition-colors ${bgColor || 'bg-neutral-000'} hover:bg-neutral-100`}>
    <div className="p-2 bg-teal/10 rounded-md mr-3">
      {React.cloneElement(icon, { className: "w-5 h-5 text-teal" })}
    </div>
    <span className="font-medium text-sm text-navy">{title}</span>
  </button>
);

const EMICalculatorPage: React.FC = () => <PlaceholderPage title="Analytics" icon={<TrendingUpIcon className="w-16 h-16 text-teal mx-auto mb-6" />} contentText="Detailed financial analytics and reports will be available here soon."/>;

const TransactionsListPage: React.FC<{ transactions: Transaction[], categories: Category[] }> = ({ transactions, categories }) => {
  if (transactions.length === 0) {
    return (
        <div className="text-center py-16 bg-neutral-000 rounded-lg shadow-card">
            <DocumentTextIcon className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-xl text-neutral-500">No transactions to display.</p>
        </div>
    );
  }
  return (
    <div className="bg-neutral-000 p-4 sm:p-5 rounded-lg shadow-card">
      <h2 className="text-xl font-semibold text-navy mb-5">All Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-200 bg-neutral-050">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Date</th>
              <th scope="col" className="px-4 py-3 font-medium">Merchant</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Amount</th>
              <th scope="col" className="px-4 py-3 font-medium">Type</th>
              <th scope="col" className="px-4 py-3 font-medium">Category</th>
              <th scope="col" className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-neutral-100 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{t.merchant}</td>
                <td className={`px-4 py-3 font-medium whitespace-nowrap text-right ${t.type === 'expense' ? 'text-error-red' : 'text-navy'}`}>
                  ₹{t.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 capitalize whitespace-nowrap text-neutral-500">{t.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{categories.find(c => c.id === t.category_id)?.name || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-500">{t.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RulesPage: React.FC = () => <PlaceholderPage title="Settings" icon={<CogIcon className="w-16 h-16 text-teal mx-auto mb-6" />} contentText="Manage your application settings and preferences here." />;

const PlaceholderPage: React.FC<{title: string, icon?: React.ReactNode, contentText?: string}> = ({ title, icon, contentText }) => (
  <div className="text-center py-16 bg-neutral-000 rounded-lg shadow-card">
    {icon}
    <h2 className="text-2xl font-semibold text-navy mb-4">{title}</h2>
    <p className="text-neutral-500 max-w-md mx-auto">{contentText}</p>
  </div>
);

// Event Page Implementation
interface EventsPageProps {
  initialEvents: Event[];
  allTransactions: Transaction[];
  categories: Category[];
  user: User;
}

const EventsPage: React.FC<EventsPageProps> = ({ initialEvents, allTransactions, categories, user }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; eventData?: Event }>({ isOpen: false, mode: 'create' });
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState<Event | null>(null);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState<Event | null>(null);

  const calculateEventTotal = useCallback((event: Event): number => {
    const eventStartDate = new Date(event.date_from);
    const eventEndDate = new Date(event.date_to);
    
    return allTransactions.reduce((total, tx) => {
      const txDate = new Date(tx.date);
      if (tx.user_id === event.user_id && 
          txDate >= eventStartDate && 
          txDate <= eventEndDate &&
          tx.type === 'expense' &&
          !(event.manuallyExcludedTransactionIds || []).includes(tx.id)) {
        return total + tx.amount;
      }
      return total;
    }, 0);
  }, [allTransactions]);

  const handleCreateEvent = (newEventData: Omit<Event, 'id' | 'user_id' | 'manuallyExcludedTransactionIds'>) => {
    const newEvent: Event = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      user_id: user.id,
      manuallyExcludedTransactionIds: [],
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsDeleteConfirmModalOpen(null);
  };
  
  const openCreateModal = () => setIsCreateEditModalOpen({ isOpen: true, mode: 'create' });
  const openEditModal = (event: Event) => setIsCreateEditModalOpen({ isOpen: true, mode: 'edit', eventData: event });
  const openViewModal = (event: Event) => setIsViewDetailsModalOpen(event);
  const openDeleteModal = (event: Event) => setIsDeleteConfirmModalOpen(event);

  const closeModals = () => {
    setIsCreateEditModalOpen({ isOpen: false, mode: 'create' });
    setIsViewDetailsModalOpen(null);
    setIsDeleteConfirmModalOpen(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 className="text-xl font-semibold text-navy">My Events</h2>
        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center bg-teal hover:bg-teal/80 text-neutral-000 font-medium py-2.5 px-5 rounded-md shadow-card transition-colors text-sm"
        >
          <PlusIcon className="w-4 h-4 mr-2" /> Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-neutral-000 rounded-lg shadow-card">
          <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-lg text-neutral-500">No events created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              totalAmount={calculateEventTotal(event)}
              onView={() => openViewModal(event)}
              onEdit={() => openEditModal(event)}
              onDelete={() => openDeleteModal(event)}
            />
          ))}
        </div>
      )}

      {isCreateEditModalOpen.isOpen && (
        <CreateEditEventModal
          mode={isCreateEditModalOpen.mode}
          eventData={isCreateEditModalOpen.eventData}
          onClose={closeModals}
          onSave={(data) => {
            if (isCreateEditModalOpen.mode === 'create') {
              handleCreateEvent(data as Omit<Event, 'id' | 'user_id' | 'manuallyExcludedTransactionIds'>);
            } else if (isCreateEditModalOpen.eventData) {
              handleUpdateEvent({ ...isCreateEditModalOpen.eventData, ...data });
            }
            closeModals();
          }}
        />
      )}

      {isViewDetailsModalOpen && (
        <ViewEventDetailsModal
          event={isViewDetailsModalOpen}
          allTransactions={allTransactions}
          categories={categories}
          onClose={closeModals}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
      
      {isDeleteConfirmModalOpen && (
        <Modal title="Confirm Deletion" onClose={closeModals}>
          <div className="space-y-4">
             <div className="flex items-start">
                <ExclamationTriangleIcon className="h-8 w-8 text-error-red mr-3 flex-shrink-0"/>
                <div>
                    <p className="text-base font-medium text-navy">Delete "{isDeleteConfirmModalOpen.name}"?</p>
                    <p className="text-sm text-neutral-500 mt-1">This action is permanent.</p>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-sm font-medium text-navy bg-neutral-100 hover:bg-neutral-200 rounded-md shadow-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(isDeleteConfirmModalOpen.id)}
                className="px-4 py-2 text-sm font-medium text-neutral-000 bg-error-red hover:bg-error-red/80 rounded-md shadow-sm transition-colors flex items-center"
              >
                <TrashIcon className="w-4 h-4 inline mr-1.5" /> Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface EventCardProps { event: Event; totalAmount: number; onView: () => void; onEdit: () => void; onDelete: () => void; }
const EventCard: React.FC<EventCardProps> = ({ event, totalAmount, onView, onEdit, onDelete }) => (
  <div className="bg-neutral-000 p-5 rounded-lg shadow-card flex flex-col justify-between transition-shadow hover:shadow-popover">
    <div>
      <h3 className="text-base font-medium text-teal mb-1 truncate">{event.name}</h3>
      <p className="text-xs text-neutral-500 mb-3">
        {new Date(event.date_from).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(event.date_to).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </p>
      <p className="text-2xl font-bold text-navy my-3">
        ₹{totalAmount.toFixed(2)}
      </p>
    </div>
    <div className="flex space-x-2 mt-3 border-t border-neutral-200 pt-3">
      <button onClick={onView} className="flex-1 text-xs flex items-center justify-center text-teal hover:bg-teal/10 p-2 rounded-md font-medium transition-colors">
        <EyeIcon className="w-4 h-4 mr-1" /> View
      </button>
      <button onClick={onEdit} className="flex-1 text-xs flex items-center justify-center text-neutral-500 hover:bg-neutral-100 p-2 rounded-md font-medium transition-colors">
        <PencilIcon className="w-3 h-3 mr-1" /> Edit
      </button>
      <button onClick={onDelete} className="flex-1 text-xs flex items-center justify-center text-error-red hover:bg-error-red/10 p-2 rounded-md font-medium transition-colors">
        <TrashIcon className="w-3 h-3 mr-1" /> Delete
      </button>
    </div>
  </div>
);

interface CreateEditEventModalProps {
  mode: 'create' | 'edit'; eventData?: Event; onClose: () => void;
  onSave: (data: Omit<Event, 'id' | 'user_id' | 'manuallyExcludedTransactionIds'> | Event) => void;
}
const CreateEditEventModal: React.FC<CreateEditEventModalProps> = ({ mode, eventData, onClose, onSave }) => {
  const [name, setName] = useState(eventData?.name || '');
  const [dateFrom, setDateFrom] = useState(eventData?.date_from ? eventData.date_from.split('T')[0] : '');
  const [dateTo, setDateTo] = useState(eventData?.date_to ? eventData.date_to.split('T')[0] : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!name.trim() || !dateFrom || !dateTo) { setError('All fields are required.'); return; }
    if (new Date(dateFrom) > new Date(dateTo)) { setError('Start date cannot be after end date.'); return; }
    const saveData = { name: name.trim(), date_from: `${dateFrom}T00:00:00Z`, date_to: `${dateTo}T23:59:59Z` };
    if (mode === 'edit' && eventData) { onSave({ ...eventData, ...saveData }); } 
    else { onSave(saveData as Omit<Event, 'id' | 'user_id' | 'manuallyExcludedTransactionIds'>); }
  };

  return (
    <Modal title={mode === 'create' ? 'Create New Event' : 'Edit Event'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-neutral-500 mb-1">Event Name</label>
          <input type="text" id="eventName" value={name} onChange={e => setName(e.target.value)} required
                 className="mt-1 w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:ring-1 focus:ring-teal focus:border-teal bg-neutral-000 text-navy placeholder-neutral-400" placeholder="e.g., Summer Vacation"/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-neutral-500 mb-1">Start Date</label>
              <input type="date" id="dateFrom" value={dateFrom} onChange={e => setDateFrom(e.target.value)} required
                     className="mt-1 w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:ring-1 focus:ring-teal focus:border-teal bg-neutral-000 text-navy" />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-neutral-500 mb-1">End Date</label>
              <input type="date" id="dateTo" value={dateTo} onChange={e => setDateTo(e.target.value)} required
                     className="mt-1 w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:ring-1 focus:ring-teal focus:border-teal bg-neutral-000 text-navy" />
            </div>
        </div>
        {error && <p className="text-xs text-error-red flex items-center"><ExclamationTriangleIcon className="w-3 h-3 mr-1"/>{error}</p>}
        <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-200">
          <button type="button" onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-navy bg-neutral-100 hover:bg-neutral-200 rounded-md shadow-sm transition-colors">
            Cancel
          </button>
          <button type="submit"
                  className="px-5 py-2 text-sm font-medium text-neutral-000 bg-teal hover:bg-teal/80 rounded-md shadow-sm transition-colors">
            {mode === 'create' ? 'Create Event' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface ViewEventDetailsModalProps {
  event: Event; allTransactions: Transaction[]; categories: Category[];
  onClose: () => void; onUpdateEvent: (updatedEvent: Event) => void;
}
const ViewEventDetailsModal: React.FC<ViewEventDetailsModalProps> = ({ event, allTransactions, categories, onClose, onUpdateEvent }) => {
  const [currentExcludedIds, setCurrentExcludedIds] = useState<string[]>(event.manuallyExcludedTransactionIds || []);

  const eventTransactions = useMemo(() => {
    const eventStartDate = new Date(event.date_from); const eventEndDate = new Date(event.date_to);
    return allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return tx.user_id === event.user_id && txDate >= eventStartDate && txDate <= eventEndDate && tx.type === 'expense';
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [event, allTransactions]);

  const eventTotal = useMemo(() => eventTransactions.reduce((total, tx) => currentExcludedIds.includes(tx.id) ? total : total + tx.amount, 0), [eventTransactions, currentExcludedIds]);

  const handleToggleTransaction = (txId: string) => {
    const newExcludedIds = currentExcludedIds.includes(txId) ? currentExcludedIds.filter(id => id !== txId) : [...currentExcludedIds, txId];
    setCurrentExcludedIds(newExcludedIds);
    onUpdateEvent({ ...event, manuallyExcludedTransactionIds: newExcludedIds });
  };
  
  return (
    <Modal title={`${event.name} Details`} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-3 max-h-[70vh] flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-neutral-200">
            <p className="text-xs text-neutral-500 mb-1 sm:mb-0">
            {new Date(event.date_from).toLocaleDateString(undefined, {dateStyle: 'medium'})} - {new Date(event.date_to).toLocaleDateString(undefined, {dateStyle: 'medium'})}
            </p>
            <p className="text-lg font-bold text-navy">Total: ₹{eventTotal.toFixed(2)}</p>
        </div>

        {eventTransactions.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No expenses in this event's date range.</p>
        ) : (
          <div className="overflow-y-auto flex-grow -mx-1 pr-1 text-sm">
            <table className="w-full text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-050 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="p-2.5 w-10 text-center">+/-</th>
                  <th scope="col" className="p-2.5">Date</th>
                  <th scope="col" className="p-2.5">Merchant</th>
                  <th scope="col" className="p-2.5 text-right">Amount</th>
                  <th scope="col" className="p-2.5">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {eventTransactions.map(tx => {
                  const isIncluded = !currentExcludedIds.includes(tx.id);
                  return (
                    <tr key={tx.id} className={`hover:bg-neutral-100 transition-colors ${!isIncluded ? 'opacity-50' : ''}`}>
                      <td className="p-2.5 text-center">
                        <input type="checkbox" checked={isIncluded} onChange={() => handleToggleTransaction(tx.id)}
                          className="w-4 h-4 text-teal bg-neutral-000 border-neutral-200 rounded focus:ring-teal cursor-pointer"/>
                      </td>
                      <td className="p-2.5 whitespace-nowrap text-neutral-500">{new Date(tx.date).toLocaleDateString(undefined, {day:'2-digit', month:'short'})}</td>
                      <td className="p-2.5 font-medium text-navy whitespace-normal break-words max-w-xs">{tx.merchant}</td>
                      <td className={`p-2.5 font-medium whitespace-nowrap text-right ${isIncluded ? 'text-error-red' : 'text-neutral-400'}`}>
                        ₹{tx.amount.toFixed(2)}
                      </td>
                      <td className="p-2.5 whitespace-nowrap text-neutral-500">{categories.find(c => c.id === tx.category_id)?.name || 'N/A'}</td>
                    </tr>);
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end pt-3 border-t border-neutral-200">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-neutral-000 bg-teal hover:bg-teal/80 rounded-md shadow-sm transition-colors">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default App;