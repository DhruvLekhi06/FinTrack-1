import React, { useState, useMemo, useEffect } from 'react';
import type { Account, AccountType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, Banknote, CreditCard, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountsProps {
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  isDemoMode?: boolean;
}

const emptyAccount = { name: '', type: 'Savings' as AccountType, balance: '' };

const Accounts: React.FC<AccountsProps> = ({ accounts, addAccount, updateAccount, deleteAccount, isDemoMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formState, setFormState] = useState(emptyAccount);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
      if (editingAccount) {
          setFormState({ ...editingAccount, balance: String(editingAccount.balance) });
      } else {
          setFormState(emptyAccount);
      }
  }, [editingAccount])

  const handleModalOpen = (account: Account | null) => {
      setEditingAccount(account);
      setIsModalOpen(true);
  }

  const handleModalClose = () => {
      setEditingAccount(null);
      setIsModalOpen(false);
  }

  const handleSaveAccount = () => {
    if (formState.name && formState.balance) {
      const accountData = { ...formState, balance: parseFloat(formState.balance) };
      if (editingAccount) {
        updateAccount({ ...accountData, id: editingAccount.id });
      } else {
        addAccount(accountData);
      }
      handleModalClose();
    }
  };
  
  const getIcon = (type: AccountType) => {
      switch(type) {
          case 'Savings':
          case 'Checking':
              return <Banknote className="h-8 w-8 text-[var(--accent-primary)]" />;
          case 'Credit Card':
              return <CreditCard className="h-8 w-8 text-[var(--accent-secondary)]" />;
      }
  }

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return accounts.filter(account => 
        account.name.toLowerCase().includes(lowerCaseQuery) ||
        account.type.toLowerCase().includes(lowerCaseQuery)
    );
  }, [accounts, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('accounts.title')}</h1>
        <Button onClick={() => handleModalOpen(null)} disabled={isDemoMode}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('accounts.addAccount')}
        </Button>
      </div>

      <div className="w-full sm:max-w-md">
        <Input 
            type="text"
            placeholder={t('accounts.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
            {filteredAccounts.map(account => (
                <motion.div
                    key={account.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <Card className="flex flex-col h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">{account.name}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{account.type}</p>
                            </div>
                            {getIcon(account.type)}
                        </div>
                        <p className="text-3xl font-bold mt-4 text-[var(--text-primary)]">
                            ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-auto pt-4 flex justify-end gap-2">
                           <button onClick={() => handleModalOpen(account)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-white/5"><Edit size={16} /></button>
                           <button onClick={() => deleteAccount(account.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-white/5"><Trash2 size={16} /></button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={editingAccount ? "Edit Account" : t('accounts.modalTitle')}>
        <div className="space-y-4">
          <Input type="text" placeholder={t('accounts.placeholderName')} value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
          <div className="relative">
             <select 
              value={formState.type} 
              onChange={e => setFormState({ ...formState, type: e.target.value as AccountType })}
              className="w-full appearance-none bg-transparent border-2 border-[var(--border-subtle)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary-glow)] focus:border-[var(--accent-primary)]"
            >
              <option className="bg-[var(--surface-secondary)]">Savings</option>
              <option className="bg-[var(--surface-secondary)]">Checking</option>
              <option className="bg-[var(--surface-secondary)]">Credit Card</option>
            </select>
          </div>
          <Input type="number" placeholder={t('accounts.placeholderBalance')} value={formState.balance} onChange={e => setFormState({ ...formState, balance: e.target.value })} />
          <Button onClick={handleSaveAccount} className="w-full">{editingAccount ? "Save Changes" : t('accounts.addAccount')}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;
