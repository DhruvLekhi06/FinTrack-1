import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useTranslation } from '../../contexts/LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, Variants } from 'framer-motion';
import { Transaction } from '../../types';

interface WeeklyExpensesProps {
  transactions: Transaction[];
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const COLORS = ['#065F46', '#047857', '#34D399', '#6B7280', '#9CA3AF', '#D1D5DB'];

const WeeklyExpenses: React.FC<WeeklyExpensesProps> = ({ transactions }) => {
  const { t } = useTranslation();

  const weeklyData = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const expenseByCategory: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo)
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
      
    return Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);


  return (
    <motion.div variants={itemVariants}>
        <Card className="h-full">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{t('dashboard.weeklyExpenses')}</h3>
            <div className="h-48">
                {weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                              cursor={{ fill: 'rgba(0,0,0,0.05)'}}
                              contentStyle={{
                                  backgroundColor: 'var(--surface-secondary)',
                                  borderColor: 'var(--border-subtle)',
                                  borderRadius: '0.75rem'
                              }}
                              formatter={(value: number, name: string) => [`₹${value.toLocaleString('en-IN')}`, name]}
                            />
                            <Pie
                                data={weeklyData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={50}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="var(--surface-primary)"
                                strokeWidth={4}
                                paddingAngle={5}
                            >
                                {weeklyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-[var(--text-secondary)]">
                        <p>No expenses recorded in the last 7 days.</p>
                    </div>
                )}
            </div>
        </Card>
    </motion.div>
  );
};

export default WeeklyExpenses;