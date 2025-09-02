import React, { useState, useMemo, useEffect } from 'react';
import type { Budget, Expense } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetsProps {
  budgets: Budget[];
  expenses: Expense[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  isDemoMode?: boolean;
}

const emptyBudget = { category: '', limit: '' };

const Budgets: React.FC<BudgetsProps> = ({ budgets, expenses, addBudget, updateBudget, deleteBudget, isDemoMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formState, setFormState] = useState(emptyBudget);
  const { t } = useTranslation();

  useEffect(() => {
      if (editingBudget) {
          setFormState({ category: editingBudget.category, limit: String(editingBudget.limit) });
      } else {
          setFormState(emptyBudget);
      }
  }, [editingBudget])

  const handleModalOpen = (budget: Budget | null) => {
      setEditingBudget(budget);
      setIsModalOpen(true);
  }

  const handleModalClose = () => {
      setEditingBudget(null);
      setIsModalOpen(false);
  }

  const handleSaveBudget = () => {
    const { category, limit } = formState;
    if (category && limit) {
      const budgetData = { category, limit: parseFloat(limit) };
      if (editingBudget) {
        updateBudget({ ...budgetData, id: editingBudget.id });
      } else {
        addBudget(budgetData);
      }
      handleModalClose();
    }
  };

  const spentByCategory = useMemo(() => {
    const spentMap: { [key: string]: number } = {};
    expenses.forEach(expense => {
      spentMap[expense.category] = (spentMap[expense.category] || 0) + expense.amount;
    });
    return spentMap;
  }, [expenses]);
  
  const getProgressBarColor = (percentage: number) => {
      if (percentage < 50) return 'bg-[var(--accent-positive)]';
      if (percentage < 90) return 'bg-[var(--accent-primary)]';
      return 'bg-[var(--accent-negative)]';
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('budgets.title')}</h1>
        <Button onClick={() => handleModalOpen(null)} disabled={isDemoMode}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('budgets.addBudget')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence>
            {budgets.map(budget => {
                const spent = spentByCategory[budget.category] || 0;
                const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
                const remaining = budget.limit - spent;

                return (
                     <motion.div
                        key={budget.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <Card>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">{budget.category}</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleModalOpen(budget)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={14} /></button>
                                    <button onClick={() => deleteBudget(budget.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1 text-[var(--text-secondary)]">
                                    <span>Spent: ₹{spent.toLocaleString('en-IN')}</span>
                                    <span>Limit: ₹{budget.limit.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="w-full bg-[var(--surface-secondary)] rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${getProgressBarColor(percentage)}`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-sm mt-2 font-medium text-[var(--text-secondary)]">
                                    {remaining >= 0 ? 'Remaining:' : 'Overspent:'} 
                                    <span className={`font-bold ${remaining >= 0 ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>
                                        ₹{Math.abs(remaining).toLocaleString('en-IN')}
                                    </span>
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )
            })}
        </AnimatePresence>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={editingBudget ? "Edit Budget" : t('budgets.modalTitle')}>
        <div className="space-y-4">
          <Input type="text" placeholder={t('budgets.placeholderCategory')} value={formState.category} onChange={e => setFormState({ ...formState, category: e.target.value })} />
          <Input type="number" placeholder={t('budgets.placeholderLimit')} value={formState.limit} onChange={e => setFormState({ ...formState, limit: e.target.value })} />
          <Button onClick={handleSaveBudget} className="w-full">{editingBudget ? "Save Changes" : t('budgets.addBudget')}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;
