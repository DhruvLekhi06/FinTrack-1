import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { useTranslation } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Budget, Expense } from '../../types';

interface MonthlyBudgetProps {
  budgets: Budget[];
  expenses: Expense[];
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const budgetColors = ['bg-[#5252ff]', 'bg-[#ff52a8]', 'bg-[#f7b731]', 'bg-[#14f195]'];

const MonthlyBudget: React.FC<MonthlyBudgetProps> = ({ budgets, expenses }) => {
    const { t } = useTranslation();

    const budgetData = useMemo(() => {
        const spentByCategory: { [key: string]: number } = {};
        expenses.forEach(expense => {
            spentByCategory[expense.category] = (spentByCategory[expense.category] || 0) + expense.amount;
        });

        return budgets.map((budget, index) => {
            const spent = spentByCategory[budget.category] || 0;
            const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
            return {
                name: budget.category,
                spent: percentage,
                color: budgetColors[index % budgetColors.length],
            };
        });
    }, [budgets, expenses]);
    
    const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();

    return (
        <motion.div variants={itemVariants}>
            <Card className="h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('dashboard.monthlyBudget')}</h3>
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    {budgetData.slice(0, 4).map(item => (
                        <div key={item.name}>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">{item.name}</p>
                            <div className="w-full bg-[var(--border-subtle)] rounded-full h-2">
                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${Math.min(item.spent, 100)}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-center text-[var(--text-secondary)] mt-4">
                    Stay within budget, {daysLeft} days left until the end of the month
                </p>
            </Card>
        </motion.div>
    );
};

export default MonthlyBudget;