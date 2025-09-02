import { Transaction, Debt, SIP, FixedDeposit, Stock, Goal, Account, Budget } from './types';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const pastDate = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - days);
    return formatDate(date);
};

export const demoData = {
    transactions: [
        { id: 't1', name: 'Salary', category: 'Income', amount: 85000, date: pastDate(15), type: 'income' },
        { id: 't2', name: 'Rent', category: 'Housing', amount: 25000, date: pastDate(14), type: 'expense' },
        { id: 't3', name: 'Groceries', category: 'Food', amount: 6500, date: pastDate(10), type: 'expense' },
        { id: 't4', name: 'Zomato Order', category: 'Food', amount: 850, date: pastDate(8), type: 'expense' },
        { id: 't5', name: 'Electricity Bill', category: 'Utilities', amount: 1200, date: pastDate(5), type: 'expense' },
        { id: 't6', name: 'Netflix Subscription', category: 'Entertainment', amount: 649, date: pastDate(4), type: 'expense' },
        { id: 't7', name: 'Freelance Project', category: 'Income', amount: 15000, date: pastDate(3), type: 'income' },
        { id: 't8', name: 'Shopping - Zara', category: 'Shopping', amount: 4200, date: pastDate(2), type: 'expense' },
    ] as Transaction[],
    debts: [
        { id: 'd1', name: 'ICICI Credit Card Bill', type: 'Credit Card', totalAmount: 35000, amountPaid: 15000, interestRate: 36 },
    ] as Debt[],
    goals: [
        { id: 'g1', name: 'Goa Vacation', targetAmount: 50000, currentAmount: 22000, deadline: formatDate(new Date(today.getFullYear(), today.getMonth() + 2, 15)) },
        { id: 'g2', name: 'New Macbook Pro', targetAmount: 180000, currentAmount: 65000, deadline: formatDate(new Date(today.getFullYear() + 1, today.getMonth(), 1)) },
    ] as Goal[],
    sips: [
        { id: 's1', fundName: 'Mirae Asset Large Cap Fund', monthlyAmount: 5000, startDate: '2022-01-05' },
    ] as SIP[],
    fds: [
        { id: 'fd1', bankName: 'HDFC Bank', principal: 100000, interestRate: 7.1, maturityDate: formatDate(new Date(today.getFullYear() + 1, 5, 20)) },
    ] as FixedDeposit[],
    stocks: [
        { id: 'st1', ticker: 'TATAMOTORS', companyName: 'Tata Motors', shares: 50, purchasePrice: 450, currentPrice: 950 },
    ] as Stock[],
    accounts: [
        { id: 'a1', name: 'HDFC Savings Account', type: 'Savings', balance: 142830 },
        { id: 'a2', name: 'ICICI Credit Card', type: 'Credit Card', balance: 35000 },
    ] as Account[],
    budgets: [
        { id: 'b1', category: 'Food', limit: 10000 },
        { id: 'b2', category: 'Shopping', limit: 8000 },
        { id: 'b3', category: 'Utilities', limit: 4000 },
    ] as Budget[],
};
