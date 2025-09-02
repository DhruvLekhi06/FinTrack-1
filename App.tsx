import React, { useState, useEffect, useCallback } from 'react';
import { Page, Transaction, Debt, SIP, FixedDeposit, Stock, Goal, Account, Budget, User, Expense } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvestmentTracker from './components/InvestmentTracker';
import DebtTracker from './components/DebtTracker';
import GoalsTracker from './components/GoalsTracker';
import AiAdvisor from './components/AiAdvisor';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import Budgets from './components/Budgets';
import Calendar from './components/Calendar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import MobileHeader from './components/MobileHeader';
import DemoBanner from './components/DemoBanner';
import { demoData } from './demoData';

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'resetPassword';

const getInitialUserData = () => ({
    transactions: [] as Transaction[],
    debts: [] as Debt[],
    goals: [] as Goal[],
    sips: [] as SIP[],
    fds: [] as FixedDeposit[],
    stocks: [] as Stock[],
    accounts: [] as Account[],
    budgets: [] as Budget[],
});

type FinancialData = ReturnType<typeof getInitialUserData>;

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

        try {
          mediaQueryList.addEventListener('change', listener);
        } catch (e) {
          mediaQueryList.addListener(listener);
        }

        return () => {
          try {
            mediaQueryList.removeEventListener('change', listener);
          } catch (e) {
            mediaQueryList.removeListener(listener);
          }
        };
    }, [query]);

    return matches;
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('signup');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // History Management for back button
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#app' && (currentUser || isDemoMode)) {
        // User pressed back from the app view
        handleLogout(); 
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser, isDemoMode]);


  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === loggedInUserId);
      if (user) {
        setCurrentUser(user);
        if (window.location.hash !== '#app') {
            window.history.pushState(null, '', '#app');
        }
      }
    }
  }, []);
  
  useEffect(() => {
    if (isDemoMode) {
      setFinancialData(demoData);
      setCurrentUser({ id: 'demo-user', name: 'Demo User', email: '', password_hash: '' });
      if (window.location.hash !== '#app') {
        window.history.pushState(null, '', '#app');
      }
      return;
    }

    if (currentUser) {
      const savedData = localStorage.getItem(`userData_${currentUser.id}`);
      if (savedData) {
        setFinancialData(JSON.parse(savedData));
      } else {
        const initialData = getInitialUserData();
        setFinancialData(initialData);
        localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(initialData));
      }
       if (window.location.hash !== '#app') {
        window.history.pushState(null, '', '#app');
      }
    } else {
      setFinancialData(null);
    }
  }, [currentUser, isDemoMode]);

  useEffect(() => {
    if (currentUser && financialData && !isDemoMode) {
      localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(financialData));
    }
  }, [financialData, currentUser, isDemoMode]);

  const updateFinancialData = useCallback((updater: (prev: FinancialData) => FinancialData) => {
    if (isDemoMode) return; // Prevent data modification in demo mode
    if (financialData) {
      setFinancialData(updater);
    }
  }, [financialData, isDemoMode]);
  
  const handleSignUp = async (name: string, email: string, password_hash: string): Promise<void> => {
    setAuthError(null);
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setAuthError('An account with this email already exists.');
      return;
    }
    const newUser: User = { id: Date.now().toString(), name, email, password_hash };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    localStorage.setItem(`userData_${newUser.id}`, JSON.stringify(getInitialUserData()));
    
    try {
        fetch('/.netlify/functions/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newUser.name, email: newUser.email }),
        });
    } catch (error) {
        console.error("Failed to trigger welcome email function:", error);
    }
    
    setCurrentUser(newUser);
    sessionStorage.setItem('loggedInUserId', newUser.id);
    sessionStorage.setItem('isNewUser', 'true');
    window.history.pushState(null, '', '#app');
  };
  
  const handleLogin = async (email: string, password_hash: string): Promise<void> => {
    setAuthError(null);
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password_hash !== password_hash) {
      setAuthError('Invalid email or password.');
      return;
    }
    setCurrentUser(user);
    sessionStorage.setItem('loggedInUserId', user.id);
    window.history.pushState(null, '', '#app');
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    sessionStorage.removeItem('loggedInUserId');
    sessionStorage.removeItem('isNewUser');
    sessionStorage.removeItem('passwordResetToken');
    setCurrentPage(Page.Dashboard);
    setAuthView('signup');
     if (window.location.hash === '#app') {
      window.history.back();
    }
  };

   const handleForgotPasswordRequest = async (email: string): Promise<{ success: boolean; message: string; token?: string; }> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        const token = `reset_${user.id}_${Date.now()}`;
        sessionStorage.setItem('passwordResetToken', JSON.stringify({ token, userId: user.id, expiry: Date.now() + 15 * 60 * 1000 }));
        return { success: true, message: "A reset token has been generated.", token: token };
    }
    return { success: false, message: "If an account with that email exists, a reset link will be sent." };
  };

  const handleResetPassword = async (token: string, new_password_hash: string): Promise<{ success: boolean; message: string; }> => {
    const tokenDataJSON = sessionStorage.getItem('passwordResetToken');
    if (!tokenDataJSON) return { success: false, message: "Invalid or expired reset token. Please request a new one." };

    const tokenData = JSON.parse(tokenDataJSON);
    if (tokenData.token !== token || Date.now() > tokenData.expiry) {
        sessionStorage.removeItem('passwordResetToken');
        return { success: false, message: "Invalid or expired reset token. Please request a new one." };
    }
    
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === tokenData.userId);

    if (userIndex === -1) {
        sessionStorage.removeItem('passwordResetToken');
        return { success: false, message: "User associated with this token not found." };
    }

    users[userIndex].password_hash = new_password_hash;
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.removeItem('passwordResetToken');
    
    return { success: true, message: "Password has been successfully reset. You can now log in." };
  };


  // Data CRUD functions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => { updateFinancialData(prev => ({ ...prev, transactions: [...prev.transactions, { ...transaction, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateTransaction = useCallback((updated: Transaction) => { updateFinancialData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === updated.id ? updated : t) })); }, [updateFinancialData]);
  const deleteTransaction = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) })); }, [updateFinancialData]);
  const addMultipleTransactions = useCallback((newTransactions: Omit<Transaction, 'id'>[]) => { updateFinancialData(prev => ({ ...prev, transactions: [ ...prev.transactions, ...newTransactions.map(t => ({ ...t, id: Date.now().toString() + Math.random() }))] })); }, [updateFinancialData]);
  
  const addAccount = useCallback((account: Omit<Account, 'id'>) => { updateFinancialData(prev => ({ ...prev, accounts: [...prev.accounts, { ...account, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateAccount = useCallback((updated: Account) => { updateFinancialData(prev => ({ ...prev, accounts: prev.accounts.map(a => a.id === updated.id ? updated : a) })); }, [updateFinancialData]);
  const deleteAccount = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) })); }, [updateFinancialData]);
  
  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => { updateFinancialData(prev => ({ ...prev, budgets: [...prev.budgets, { ...budget, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateBudget = useCallback((updated: Budget) => { updateFinancialData(prev => ({ ...prev, budgets: prev.budgets.map(b => b.id === updated.id ? updated : b) })); }, [updateFinancialData]);
  const deleteBudget = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, budgets: prev.budgets.filter(b => b.id !== id) })); }, [updateFinancialData]);

  const addDebt = useCallback((debt: Omit<Debt, 'id'>) => { updateFinancialData(prev => ({ ...prev, debts: [...prev.debts, { ...debt, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateDebt = useCallback((updated: Debt) => { updateFinancialData(prev => ({ ...prev, debts: prev.debts.map(d => d.id === updated.id ? updated : d) })); }, [updateFinancialData]);
  const deleteDebt = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) })); }, [updateFinancialData]);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'currentAmount'>) => { updateFinancialData(prev => ({ ...prev, goals: [...prev.goals, { ...goal, id: Date.now().toString(), currentAmount: 0 }] })); }, [updateFinancialData]);
  const updateGoal = useCallback((updated: Goal) => { updateFinancialData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === updated.id ? updated : g) })); }, [updateFinancialData]);
  const deleteGoal = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) })); }, [updateFinancialData]);
  const updateGoalProgress = useCallback((goalId: string, additionalAmount: number) => { updateFinancialData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === goalId ? { ...g, currentAmount: Math.min(g.currentAmount + additionalAmount, g.targetAmount) } : g) })); }, [updateFinancialData]);
  
  const addSip = useCallback((sip: Omit<SIP, 'id'>) => { updateFinancialData(prev => ({ ...prev, sips: [...prev.sips, { ...sip, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateSip = useCallback((updated: SIP) => { updateFinancialData(prev => ({ ...prev, sips: prev.sips.map(s => s.id === updated.id ? updated : s) })); }, [updateFinancialData]);
  const deleteSip = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, sips: prev.sips.filter(s => s.id !== id) })); }, [updateFinancialData]);

  const addFd = useCallback((fd: Omit<FixedDeposit, 'id'>) => { updateFinancialData(prev => ({ ...prev, fds: [...prev.fds, { ...fd, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateFd = useCallback((updated: FixedDeposit) => { updateFinancialData(prev => ({ ...prev, fds: prev.fds.map(f => f.id === updated.id ? updated : f) })); }, [updateFinancialData]);
  const deleteFd = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, fds: prev.fds.filter(f => f.id !== id) })); }, [updateFinancialData]);

  const addStock = useCallback((stock: Omit<Stock, 'id'>) => { updateFinancialData(prev => ({ ...prev, stocks: [...prev.stocks, { ...stock, id: Date.now().toString() }] })); }, [updateFinancialData]);
  const updateStock = useCallback((updated: Stock) => { updateFinancialData(prev => ({ ...prev, stocks: prev.stocks.map(s => s.id === updated.id ? updated : s) })); }, [updateFinancialData]);
  const deleteStock = useCallback((id: string) => { updateFinancialData(prev => ({ ...prev, stocks: prev.stocks.filter(s => s.id !== id) })); }, [updateFinancialData]);
  
  const navigateToPage = (page: Page) => setCurrentPage(page);

  const renderContent = () => {
    if (!financialData || !currentUser) return null;
    const expenses = financialData.transactions.filter((t): t is Expense => t.type === 'expense');
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard transactions={financialData.transactions} budgets={financialData.budgets} goals={financialData.goals} accounts={financialData.accounts} currentUser={currentUser} navigateToPage={navigateToPage} />;
      case Page.Transactions:
          return <Transactions transactions={financialData.transactions} addTransaction={addTransaction} addMultipleTransactions={addMultipleTransactions} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} isMobile={isMobile} isDemoMode={isDemoMode} />;
      case Page.Accounts:
          return <Accounts accounts={financialData.accounts} addAccount={addAccount} updateAccount={updateAccount} deleteAccount={deleteAccount} isDemoMode={isDemoMode} />;
      case Page.Budgets:
          return <Budgets budgets={financialData.budgets} addBudget={addBudget} expenses={expenses} updateBudget={updateBudget} deleteBudget={deleteBudget} isDemoMode={isDemoMode} />;
      case Page.Calendar:
          return <Calendar transactions={financialData.transactions} fds={financialData.fds} />;
      case Page.Investments:
        return <InvestmentTracker sips={financialData.sips} fds={financialData.fds} stocks={financialData.stocks} addSip={addSip} addFd={addFd} addStock={addStock} updateSip={updateSip} deleteSip={deleteSip} updateFd={updateFd} deleteFd={deleteFd} updateStock={updateStock} deleteStock={deleteStock} isMobile={isMobile} isDemoMode={isDemoMode} />;
      case Page.Debts:
        return <DebtTracker debts={financialData.debts} addDebt={addDebt} updateDebt={updateDebt} deleteDebt={deleteDebt} isDemoMode={isDemoMode} />;
      case Page.Goals:
        return <GoalsTracker goals={financialData.goals} addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal} updateGoalProgress={updateGoalProgress} isDemoMode={isDemoMode} />;
      case Page.AIAdvisor:
        return <AiAdvisor financialData={financialData} userId={currentUser.id} isMobile={isMobile} />;
      default:
        return <Dashboard transactions={financialData.transactions} budgets={financialData.budgets} goals={financialData.goals} accounts={financialData.accounts} currentUser={currentUser} navigateToPage={navigateToPage} />;
    }
  };
  
  const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 }, };
  const pageTransition: Transition = { type: 'tween', ease: 'anticipate', duration: 0.4, };
  
  const renderAuth = () => {
     switch(authView) {
        case 'login':
            return <Login onLogin={handleLogin} onSwitchToSignUp={() => { setAuthView('signup'); setAuthError(null); }} onForgotPassword={() => { setAuthView('forgotPassword'); setAuthError(null); }} error={authError} />;
        case 'signup':
            return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { setAuthView('login'); setAuthError(null); }} error={authError} onExploreDemo={() => setIsDemoMode(true)} />;
        case 'forgotPassword':
            return <ForgotPassword onForgotPasswordRequest={handleForgotPasswordRequest} onSwitchToLogin={() => setAuthView('login')} onSwitchToReset={() => setAuthView('resetPassword')} />;
        case 'resetPassword':
            return <ResetPassword onResetPassword={handleResetPassword} onSwitchToLogin={() => setAuthView('login')} />;
        default:
            return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => setAuthView('login')} error={authError} onExploreDemo={() => setIsDemoMode(true)} />;
     }
  }

  if (!currentUser) {
    return (
      <div className="bg-dark-primary min-h-screen">
          {renderAuth()}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {isDemoMode && <DemoBanner onExit={() => handleLogout()} />}
      
      {isMobile && <MobileHeader onMenuClick={() => setIsMobileNavOpen(true)} currentPage={currentPage} />}

      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        handleLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />
      <main className={`flex-1 transition-all duration-300 ${isDemoMode ? 'pt-12' : ''} ${
        isMobile 
        ? 'pt-20 px-4 pb-4'
        : `p-6 sm:p-8 md:p-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-[72px] md:ml-64'}`
      }`}>
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;