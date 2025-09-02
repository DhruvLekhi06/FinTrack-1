import React, { useState, useMemo, useEffect } from 'react';
import type { Debt } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, PiggyBank, CreditCard, Landmark, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, Variants, AnimatePresence } from 'framer-motion';

interface DebtTrackerProps {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (id: string) => void;
  isDemoMode?: boolean;
}

const DebtCard: React.FC<{debt: Debt; onEdit: () => void; onDelete: () => void;}> = ({ debt, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const percentagePaid = debt.totalAmount > 0 ? (debt.amountPaid / debt.totalAmount) * 100 : 0;
    const remainingAmount = debt.totalAmount - debt.amountPaid;

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{debt.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{debt.type}</p>
                </div>
                 <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={14} /></button>
                    <button onClick={onDelete} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={14} /></button>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1 text-[var(--text-secondary)]">
                    <span>{t('debts.paid')}: ₹{debt.amountPaid.toLocaleString('en-IN')}</span>
                    <span>{t('debts.total')}: ₹{debt.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-[var(--surface-secondary)] rounded-full h-2.5">
                    <div className="bg-[var(--accent-positive)] h-2.5 rounded-full" style={{ width: `${percentagePaid}%` }}></div>
                </div>
                <p className="text-right text-sm mt-2 font-medium text-[var(--text-secondary)]">{t('debts.remaining')}: <span className="text-[var(--accent-negative)] font-bold">₹{remainingAmount.toLocaleString('en-IN')}</span></p>
            </div>
        </Card>
    );
};

const emptyDebt = { name: '', type: 'Credit Card' as Debt['type'], totalAmount: '', amountPaid: '', interestRate: '' };

const DebtTracker: React.FC<DebtTrackerProps> = ({ debts, addDebt, updateDebt, deleteDebt, isDemoMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formState, setFormState] = useState(emptyDebt);
  const { t } = useTranslation();

  const { creditCardDebts, loanDebts } = useMemo(() => ({
      creditCardDebts: debts.filter(d => d.type === 'Credit Card'),
      loanDebts: debts.filter(d => d.type !== 'Credit Card')
  }), [debts]);
  
  useEffect(() => {
    if (editingDebt) {
        setFormState({
            ...editingDebt,
            totalAmount: String(editingDebt.totalAmount),
            amountPaid: String(editingDebt.amountPaid),
            interestRate: String(editingDebt.interestRate)
        });
    } else {
        setFormState(emptyDebt);
    }
  }, [editingDebt]);

  const handleModalOpen = (debt: Debt | null) => {
      setEditingDebt(debt);
      setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
      setEditingDebt(null);
      setIsModalOpen(false);
  };

  const handleSaveDebt = () => {
    const { name, totalAmount, amountPaid, interestRate, type } = formState;
    if (name && totalAmount && amountPaid && interestRate) {
        const debtData = { name, type, totalAmount: parseFloat(totalAmount), amountPaid: parseFloat(amountPaid), interestRate: parseFloat(interestRate) };
        if (editingDebt) {
            updateDebt({ ...debtData, id: editingDebt.id });
        } else {
            addDebt(debtData);
        }
      handleModalClose();
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  // FIX: Simplified the 'icon' prop type to resolve a TypeScript error with React.cloneElement.
  // The previous generic type `P` was causing issues with type inference.
  const renderDebtList = (list: Debt[], title: string, icon: React.ReactElement<{ className?: string }>) => {
    const iconWithClasses = React.cloneElement(icon, {
        className: [icon.props.className, 'mr-3 h-6 w-6'].filter(Boolean).join(' ')
    });

    return (
        <div>
            <h2 className="text-2xl font-bold flex items-center mb-4">{iconWithClasses} {title}</h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                {list.map((debt) => (
                    <motion.div key={debt.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                        <DebtCard debt={debt} onEdit={() => handleModalOpen(debt)} onDelete={() => deleteDebt(debt.id)} />
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">{t('debts.title')}</h1>
        <Button onClick={() => handleModalOpen(null)} disabled={isDemoMode}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('debts.addDebt')}
        </Button>
      </div>

      {debts.length > 0 ? (
        <div className="space-y-8">
            {creditCardDebts.length > 0 && renderDebtList(creditCardDebts, "Credit Cards", <CreditCard className="text-[var(--accent-negative)]"/>)}
            {loanDebts.length > 0 && renderDebtList(loanDebts, "Loans", <Landmark className="text-slate-500"/>)}
        </div>
      ) : (
        <Card>
            <div className="text-center text-[var(--text-secondary)] py-16 flex flex-col items-center justify-center">
              <PiggyBank className="h-16 w-16 text-[var(--text-secondary)]/50 mb-4" />
              <h3 className="font-bold text-lg text-[var(--text-primary)]">{t('debts.emptyTitle')}</h3>
              <p className="mt-1">{t('debts.emptyDescription')}</p>
            </div>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={editingDebt ? "Edit Debt" : t('debts.modalTitle')}>
        <div className="space-y-4">
          <Input type="text" placeholder={t('debts.placeholderName')} value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
           <select 
              value={formState.type} 
              onChange={e => setFormState({ ...formState, type: e.target.value as Debt['type'] })}
              className="w-full appearance-none bg-[var(--surface-secondary)]/50 border border-[var(--border-subtle)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-glow)] focus:border-[var(--accent-primary)]"
            >
              <option className="bg-[var(--surface-primary)]">Credit Card</option>
              <option className="bg-[var(--surface-primary)]">Personal Loan</option>
              <option className="bg-[var(--surface-primary)]">Mortgage</option>
              <option className="bg-[var(--surface-primary)]">Other</option>
            </select>
          <Input type="number" placeholder={t('investments.modal.principalPlaceholder')} value={formState.totalAmount} onChange={e => setFormState({ ...formState, totalAmount: e.target.value })} />
          <Input type="number" placeholder={t('debts.paid')} value={formState.amountPaid} onChange={e => setFormState({ ...formState, amountPaid: e.target.value })} />
          <Input type="number" placeholder={t('investments.modal.interestRatePlaceholder')} value={formState.interestRate} onChange={e => setFormState({ ...formState, interestRate: e.target.value })} />
          <Button onClick={handleSaveDebt} className="w-full">{editingDebt ? "Save Changes" : t('debts.addDebt')}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default DebtTracker;