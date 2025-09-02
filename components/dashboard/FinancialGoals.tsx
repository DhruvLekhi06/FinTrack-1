import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useTranslation } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { motion, Variants } from 'framer-motion';
import { Goal } from '../../types';

interface FinancialGoalsProps {
  goals: Goal[];
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const colors = ['#065F46', '#047857', '#6B7280', '#9CA3AF'];

const FinancialGoals: React.FC<FinancialGoalsProps> = ({ goals }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    return goals.map(goal => ({
      name: goal.name,
      value: goal.currentAmount,
      target: goal.targetAmount,
    }));
  }, [goals]);

  return (
    <motion.div variants={itemVariants}>
        <Card className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('dashboard.financialGoals')}</h3>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 0, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} interval={0} angle={-20} textAnchor="end" height={50} />
                        <YAxis stroke="var(--text-secondary)" fontSize={10} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN', { notation: 'compact' })}`} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.05)'}}
                          contentStyle={{
                              backgroundColor: 'var(--surface-secondary)',
                              borderColor: 'var(--border-subtle)',
                              borderRadius: '0.75rem'
                          }}
                          formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    </motion.div>
  );
};

export default FinancialGoals;