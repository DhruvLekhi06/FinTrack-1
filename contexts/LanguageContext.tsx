import React, { createContext, useState, useContext, ReactNode } from 'react';

// Basic translation structure
const translations = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      accounts: 'Accounts',
      budgets: 'Budgets',
      debts: 'Debts',
      goals: 'Goals',
      investments: 'Investments',
      calendar: 'Calendar',
      aiAdvisor: 'AI Advisor',
      language: 'Language',
      theme: 'Theme',
      logout: 'Logout',
    },
    dashboard: {
        title: "Welcome Back",
        totalBalance: 'Total Balance',
        income: 'Income',
        expenses: 'Expenses',
        savings: 'Savings',
        monthlyBudget: 'Monthly Budget',
        financialGoals: 'Financial Goals',
        weeklyExpenses: 'Weekly Expenses',
    },
    goals: {
        title: "Financial Goals",
        addGoal: "Add Goal",
        deadlinePassed: "Deadline Passed",
        dueToday: "Due Today",
        daysLeft: "days left",
        saved: "Saved",
        target: "Target",
        addProgress: "Add Progress",
        emptyTitle: "Set Your First Goal!",
        emptyDescription: "Define your financial targets to start your journey.",
        modalAddTitle: "Set a New Goal",
        placeholderName: "Goal Name (e.g., Buy a new laptop)",
        placeholderTargetAmount: "Target Amount",
        placeholderTargetDate: "Target Date",
        setGoal: "Set Goal",
        modalUpdateTitle: "Update Progress for",
        currentProgress: "Current Progress",
        placeholderAmountToAdd: "Amount to add",
        saveProgress: "Save Progress",
    },
    transactions: {
      title: "Transactions",
      addTransaction: "Add Transaction",
      all: "All",
      income: "Income",
      expense: "Expense",
      searchPlaceholder: "Search by name or category...",
      table: {
        name: "Name",
        category: "Category",
        amount: "Amount",
        date: "Date"
      },
      modalTitle: "Add a New Transaction",
      placeholderName: "Transaction Name",
      placeholderCategory: "Category",
      placeholderAmount: "Amount",
      placeholderDate: "Date"
    },
    accounts: {
      title: "Accounts",
      addAccount: "Add Account",
      searchPlaceholder: "Search accounts...",
      modalTitle: "Add a New Account",
      placeholderName: "Account Name (e.g., HDFC Savings)",
      placeholderBalance: "Current Balance"
    },
    budgets: {
        title: "Budgets",
        addBudget: "Add Budget",
        modalTitle: "Add New Budget",
        placeholderCategory: "Category (e.g., Food)",
        placeholderLimit: "Monthly Limit"
    },
    debts: {
      title: "Debt Management",
      addDebt: "Add Debt",
      apr: "APR",
      paid: "Paid",
      total: "Total",
      remaining: "Remaining",
      emptyTitle: "You're Debt-Free!",
      emptyDescription: "No debts to display. Add one to start tracking.",
      modalTitle: "Add a New Debt",
      placeholderName: "Debt Name (e.g., Car Loan)"
    },
    investments: {
        title: "Investment Portfolio",
        sip: "SIP",
        fd: "FD",
        stock: "Stock",
        add: "Add",
        tabs: {
            stocks: "Stocks",
            sips: "SIPs",
            fds: "Fixed Deposits"
        },
        stocksTable: {
            company: "Company",
            shares: "Shares",
            totalValue: "Total Value",
            gainLoss: "P/L"
        },
        sipsTable: {
            fundName: "Fund Name",
            monthlyAmount: "Monthly Amount",
            startDate: "Start Date"
        },
        fdsTable: {
            bank: "Bank",
            principal: "Principal",
            interestRate: "Interest Rate",
            maturityDate: "Maturity Date"
        },
        modal: {
            fundNamePlaceholder: "Fund Name",
            monthlyAmountPlaceholder: "Monthly Amount",
            startDatePlaceholder: "Start Date",
            bankNamePlaceholder: "Bank Name",
            principalPlaceholder: "Principal Amount",
            interestRatePlaceholder: "Interest Rate (%)",
            maturityDatePlaceholder: "Maturity Date",
            tickerPlaceholder: "Ticker (e.g., TATAMOTORS)",
            companyNamePlaceholder: "Company Name",
            sharesPlaceholder: "Number of Shares",
            purchasePricePlaceholder: "Purchase Price per Share",
            currentPricePlaceholder: "Current Price per Share",
            addSipTitle: "Add New SIP",
            addFdTitle: "Add New Fixed Deposit",
            addStockTitle: "Add New Stock Holding",
        }
    },
    calendar: {
        title: "Financial Calendar",
    },
    advisor: {
        title: "AI Financial Advisor",
        subtitle: "Get personalized insights and recommendations on your financial data from our advanced AI.",
        buttonGenerate: "Generate Advice",
        buttonGenerating: "Generating...",
        error: "Sorry, I couldn't generate advice right now. Please try again later.",
        emptyTitle: "Ready for your financial check-up?",
        emptyDescription: "Click the button above to get your personalized financial analysis."
    }
  },
  hi: {
    sidebar: {
      dashboard: 'डैशबोर्ड',
      transactions: 'लेन-देन',
      accounts: 'खाते',
      budgets: 'बजट',
      debts: 'कर्ज',
      goals: 'लक्ष्य',
      investments: 'निवेश',
      calendar: 'कैलेंडर',
      aiAdvisor: 'एआई सलाहकार',
      language: 'भाषा',
      theme: 'थीम',
      logout: 'लॉग आउट',
    },
    dashboard: {
        title: "वापसी पर स्वागत है",
        totalBalance: 'कुल शेष',
        income: 'आय',
        expenses: 'खर्च',
        savings: 'बचत',
        monthlyBudget: 'मासिक बजट',
        financialGoals: 'वित्तीय लक्ष्य',
        weeklyExpenses: 'साप्ताहिक खर्च',
    },
  }
};

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
           fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};