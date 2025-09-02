import React from 'react';
import { motion, Variants } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Transaction } from '../../types';

interface SummaryCardProps {
  title: string;
  amount: number;
  transactions: Transaction[];
  type?: 'income' | 'expense' | undefined;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const MiniChart: React.FC<{ transactions: Transaction[], type?: 'income' | 'expense' }> = ({ transactions, type }) => {
    let data;
    if (type === 'income') {
        data = transactions.filter(t => t.type === 'income').map(t => ({ amt: t.amount }));
    } else if (type === 'expense') {
        data = transactions.filter(t => t.type === 'expense').map(t => ({ amt: t.amount }));
    } else { // Savings or Balance
        const netFlows = transactions.reduce((acc, t) => {
            const date = t.date;
            acc[date] = (acc[date] || 0) + (t.type === 'income' ? t.amount : -t.amount);
            return acc;
        }, {} as Record<string, number>);
        data = Object.values(netFlows).map(amt => ({ amt }));
    }

    const strokeColor = type === 'income' ? 'var(--accent-positive)' : type === 'expense' ? 'var(--accent-negative)' : 'var(--accent-primary)';

    return (
        <div className="w-full h-16">
            <ResponsiveContainer>
                <LineChart data={data.slice(-30)}>
                    <Line type="monotone" dataKey="amt" stroke={strokeColor} strokeWidth={2.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, transactions, type }) => {
  return (
    <motion.div variants={itemVariants} className="bg-[var(--surface-primary)] p-5 rounded-2xl border border-[var(--border-subtle)]">
      <p className="text-sm text-[var(--text-secondary)] font-semibold">{title}</p>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
          ₹{amount.toLocaleString('en-IN', { notation: 'compact', maximumFractionDigits: 2 })}
      </p>
       <div className="mt-4 -ml-5 -mr-2">
            <MiniChart transactions={transactions} type={type} />
       </div>
    </motion.div>
  );
};

export default SummaryCard;