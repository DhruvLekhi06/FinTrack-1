import React, { useState, useEffect } from 'react';
import type { Goal } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, Trash2, Edit, TrendingUp, Target } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface GoalsTrackerProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  deleteGoal: (goalId: string) => void;
  isDemoMode?: boolean;
}

const GoalCard: React.FC<{ goal: Goal; onDelete: () => void; onUpdateProgress: () => void; onEdit: () => void; }> = ({ goal, onDelete, onUpdateProgress, onEdit }) => {
    const { t } = useTranslation();
    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    
    const daysLeft = (deadline: string) => {
      const today = new Date();
      const deadLineDate = new Date(deadline);
      today.setHours(0, 0, 0, 0);
      deadLineDate.setHours(0, 0, 0, 0);
      const diffTime = deadLineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return t('goals.deadlinePassed');
      if (diffDays === 0) return t('goals.dueToday');
      return `${diffDays} ${t('goals.daysLeft')}`;
    }
    
    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{goal.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{daysLeft(goal.deadline)}</p>
                </div>
                 <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={14} /></button>
                    <button onClick={onDelete} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={14} /></button>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1 text-[var(--text-secondary)]">
                    <span>{t('goals.saved')}: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span>{t('goals.target')}: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-[var(--surface-secondary)] rounded-full h-2.5">
                    <div className="bg-[var(--accent-positive)] h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="text-right mt-4">
                    <Button size="sm" variant="secondary" onClick={onUpdateProgress}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        {t('goals.addProgress')}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

const emptyGoal = { name: '', targetAmount: '', deadline: '' };

const GoalsTracker: React.FC<GoalsTrackerProps> = ({ goals, addGoal, updateGoal, updateGoalProgress, deleteGoal, isDemoMode }) => {
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { t } = useTranslation();

  const [formState, setFormState] = useState(emptyGoal);
  const [updateAmount, setUpdateAmount] = useState('');

  useEffect(() => {
    if (editingGoal) {
        setFormState({
            name: editingGoal.name,
            targetAmount: String(editingGoal.targetAmount),
            deadline: editingGoal.deadline
        })
    } else {
        setFormState(emptyGoal);
    }
  }, [editingGoal])

  const handleModalOpen = (goal: Goal | null) => {
      setEditingGoal(goal);
      setAddEditModalOpen(true);
  }

  const handleModalClose = () => {
      setEditingGoal(null);
      setAddEditModalOpen(false);
      setFormState(emptyGoal);
  }

  const handleSaveGoal = () => {
    const { name, targetAmount, deadline } = formState;
    if (name && targetAmount && deadline) {
        if (editingGoal) {
            updateGoal({
                ...editingGoal,
                name,
                targetAmount: parseFloat(targetAmount),
                deadline,
            });
        } else {
            addGoal({ name, targetAmount: parseFloat(targetAmount), deadline });
        }
      handleModalClose();
    }
  };

  const handleUpdateProgress = () => {
    if (isUpdateModalOpen && updateAmount) {
        updateGoalProgress(isUpdateModalOpen.id, parseFloat(updateAmount));
        setUpdateAmount('');
        setIsUpdateModalOpen(null);
    }
  }
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('goals.title')}</h1>
        <Button onClick={() => handleModalOpen(null)} disabled={isDemoMode}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('goals.addGoal')}
        </Button>
      </div>

      {goals.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
            {goals.map((goal) => (
                <motion.div key={goal.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                    <GoalCard 
                        goal={goal} 
                        onDelete={() => deleteGoal(goal.id)} 
                        onEdit={() => handleModalOpen(goal)}
                        onUpdateProgress={() => setIsUpdateModalOpen(goal)} 
                    />
                </motion.div>
            ))}
            </AnimatePresence>
        </motion.div>
      ) : (
        <Card>
            <div className="text-center text-[var(--text-secondary)] py-16 flex flex-col items-center justify-center">
                <Target className="h-16 w-16 text-[var(--text-secondary)]/50 mb-4" />
                <h3 className="font-bold text-lg text-[var(--text-primary)]">{t('goals.emptyTitle')}</h3>
                <p className="mt-1">{t('goals.emptyDescription')}</p>
            </div>
        </Card>
      )}

      <Modal isOpen={isAddEditModalOpen} onClose={handleModalClose} title={editingGoal ? "Edit Goal" : t('goals.modalAddTitle')}>
        <div className="space-y-4">
          <Input type="text" placeholder={t('goals.placeholderName')} value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
          <Input type="number" placeholder={t('goals.placeholderTargetAmount')} value={formState.targetAmount} onChange={e => setFormState({ ...formState, targetAmount: e.target.value })} />
          <Input type="date" placeholder={t('goals.placeholderTargetDate')} value={formState.deadline} onChange={e => setFormState({ ...formState, deadline: e.target.value })} />
          <Button onClick={handleSaveGoal} className="w-full">{editingGoal ? "Save Changes" : t('goals.setGoal')}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(null)} title={`${t('goals.modalUpdateTitle')} "${isUpdateModalOpen?.name}"`}>
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">{t('goals.currentProgress')}: <span>₹{isUpdateModalOpen?.currentAmount.toLocaleString('en-IN')} / ₹{isUpdateModalOpen?.targetAmount.toLocaleString('en-IN')}</span></p>
          <Input type="number" placeholder={t('goals.placeholderAmountToAdd')} value={updateAmount} onChange={e => setUpdateAmount(e.target.value)} autoFocus/>
          <Button onClick={handleUpdateProgress} className="w-full">{t('goals.saveProgress')}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default GoalsTracker;
