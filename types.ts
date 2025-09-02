export enum Page {
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  Accounts = 'Accounts',
  Budgets = 'Budgets',
  Calendar = 'Calendar',
  Investments = 'Investments',
  Debts = 'Debts',
  Goals = 'Goals',
  AIAdvisor = 'AI Advisor',
}

export type TransactionType = 'income' | 'expense';
export type Expense = Transaction & { type: 'expense' };

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
}

export type DebtType = 'Credit Card' | 'Personal Loan' | 'Mortgage' | 'Other';

export interface Debt {
  id:string;
  name: string;
  type: DebtType;
  totalAmount: number;
  amountPaid: number;
  interestRate: number; // Annual percentage rate
}

export interface SIP {
  id: string;
  fundName: string;
  monthlyAmount: number;
  startDate: string;
}

export interface FixedDeposit {
  id: string;
  bankName: string;
  principal: number;
  interestRate: number;
  maturityDate: string;
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export type AccountType = 'Savings' | 'Checking' | 'Credit Card';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}