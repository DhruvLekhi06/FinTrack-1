import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Transaction, TransactionType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, Upload, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionsProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addMultipleTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  isMobile: boolean;
  isDemoMode?: boolean;
}

const emptyTransaction = { name: '', category: '', amount: '', date: new Date().toISOString().split('T')[0], type: 'expense' as TransactionType };

const TransactionCard: React.FC<{transaction: Transaction, onEdit: (t: Transaction) => void, onDelete: (id: string) => void}> = ({ transaction, onEdit, onDelete }) => {
    return (
         <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
            <Card>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {transaction.type === 'income' ? <ArrowUpCircle className="h-8 w-8 text-[var(--accent-positive)]" /> : <ArrowDownCircle className="h-8 w-8 text-[var(--accent-negative)]" />}
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">{transaction.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{transaction.category}</p>
                        </div>
                    </div>
                     <div className="flex flex-col items-end">
                        <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{transaction.date}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)]">
                   <button onClick={() => onEdit(transaction)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={16} /></button>
                   <button onClick={() => onDelete(transaction.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={16} /></button>
                </div>
            </Card>
        </motion.div>
    )
}


const Transactions: React.FC<TransactionsProps> = ({ transactions, addTransaction, updateTransaction, deleteTransaction, addMultipleTransactions, isMobile, isDemoMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState(emptyTransaction);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen && editingTransaction) {
        setNewTransaction({
            ...editingTransaction,
            amount: String(editingTransaction.amount)
        });
    } else {
        setNewTransaction(emptyTransaction);
    }
  }, [isModalOpen, editingTransaction])
  
  const handleModalOpen = (transaction: Transaction | null = null) => {
      setEditingTransaction(transaction);
      setIsModalOpen(true);
  }

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingTransaction(null);
      setNewTransaction(emptyTransaction);
  }

  const handleSaveTransaction = () => {
    const { name, category, amount, date } = newTransaction;
    if (name && category && amount && date) {
      const transactionData = { ...newTransaction, amount: parseFloat(amount) };
      if (editingTransaction) {
        updateTransaction({ ...transactionData, id: editingTransaction.id });
      } else {
        addTransaction(transactionData);
      }
      handleModalClose();
    }
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
            const parsedTransactions = parseCSV(text);
            addMultipleTransactions(parsedTransactions);
            alert(`${parsedTransactions.length} transactions imported successfully!`);
        } catch (error: any) {
            alert(`Error importing CSV: ${error.message}`);
        }
    };
    reader.readAsText(file);
    if(event.target) event.target.value = '';
  };

  const parseCSV = (csvText: string): Omit<Transaction, 'id'>[] => {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['date', 'name', 'category', 'amount', 'type'];
    
    const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) throw new Error(`Missing required CSV columns: ${missingHeaders.join(', ')}`);

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const row = header.reduce((obj, col, index) => {
            obj[col] = values[index]?.trim();
            return obj;
        }, {} as any);

        const amount = parseFloat(row.amount);
        const type = row.type.toLowerCase();

        if (!row.date || !row.name || !row.category || isNaN(amount) || (type !== 'income' && type !== 'expense')) {
            console.warn(`Skipping invalid row: ${line}`);
            return null;
        }

        return {
            date: new Date(row.date).toISOString().split('T')[0],
            name: row.name,
            category: row.category,
            amount,
            type: type as TransactionType,
        };
    }).filter((t): t is Omit<Transaction, 'id'> => t !== null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
          const matchesFilter = filter === 'all' || t.type === filter;
          if (!searchQuery) return matchesFilter;
          const lowerCaseQuery = searchQuery.toLowerCase();
          return matchesFilter && (t.name.toLowerCase().includes(lowerCaseQuery) || t.category.toLowerCase().includes(lowerCaseQuery));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('transactions.title')}</h1>
        <div className="flex gap-2 self-end sm:self-auto">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            <Button onClick={handleImportClick} variant="secondary" size="md" disabled={isDemoMode}>
                <Upload className="mr-2 h-4 w-4" />
                Import
            </Button>
            <Button onClick={() => handleModalOpen()} size="md" disabled={isDemoMode}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('transactions.addTransaction')}
            </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2 bg-[var(--surface-secondary)] p-1 rounded-lg">
            <FilterButton label={t('transactions.all')} active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterButton label={t('transactions.income')} active={filter === 'income'} onClick={() => setFilter('income')} />
            <FilterButton label={t('transactions.expense')} active={filter === 'expense'} onClick={() => setFilter('expense')} />
        </div>
        <div className="w-full sm:w-auto sm:max-w-xs">
           <Input 
              type="text"
              placeholder={t('transactions.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
        {isMobile ? (
            <div className="space-y-4">
                <AnimatePresence>
                {filteredTransactions.map(transaction => (
                    <TransactionCard 
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={handleModalOpen}
                        onDelete={deleteTransaction}
                    />
                ))}
                </AnimatePresence>
            </div>
        ) : (
            <Card>
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                        <th className="p-4 font-semibold text-left text-[var(--text-secondary)] uppercase tracking-wider text-sm">{t('transactions.table.name')}</th>
                        <th className="p-4 font-semibold text-left text-[var(--text-secondary)] uppercase tracking-wider text-sm">{t('transactions.table.category')}</th>
                        <th className="p-4 font-semibold text-right text-[var(--text-secondary)] uppercase tracking-wider text-sm">{t('transactions.table.amount')}</th>
                        <th className="p-4 font-semibold text-left text-[var(--text-secondary)] uppercase tracking-wider text-sm">{t('transactions.table.date')}</th>
                        <th className="p-4 font-semibold text-right text-[var(--text-secondary)] uppercase tracking-wider text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody >
                        <AnimatePresence>
                        {filteredTransactions.map(transaction => (
                            <motion.tr 
                            key={transaction.id} 
                            className="border-b border-[var(--border-subtle)] last:border-b-0"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            >
                            <td className="p-4 font-semibold text-[var(--text-primary)] flex items-center">
                                {transaction.type === 'income' ? <ArrowUpCircle className="h-5 w-5 text-[var(--accent-positive)] mr-3" /> : <ArrowDownCircle className="h-5 w-5 text-[var(--accent-negative)] mr-3" />}
                                {transaction.name}
                            </td>
                            <td className="p-4 text-[var(--text-secondary)]">{transaction.category}</td>
                            <td className={`p-4 font-semibold text-right ${transaction.type === 'income' ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>
                                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                            </td>
                            <td className="p-4 text-[var(--text-secondary)]">{transaction.date}</td>
                            <td className="p-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                                <button onClick={() => handleModalOpen(transaction)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={16} /></button>
                                <button onClick={() => deleteTransaction(transaction.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={16} /></button>
                            </div>
                            </td>
                            </motion.tr>
                        ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                </div>
            </Card>
        )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={editingTransaction ? 'Edit Transaction' : t('transactions.modalTitle')}>
        <div className="space-y-4">
          <div className="flex gap-2">
              <Button onClick={() => setNewTransaction(t => ({...t, type: 'income'}))} variant={newTransaction.type === 'income' ? 'primary' : 'secondary'} className="w-full">{t('transactions.income')}</Button>
              <Button onClick={() => setNewTransaction(t => ({...t, type: 'expense'}))} variant={newTransaction.type === 'expense' ? 'primary' : 'secondary'} className="w-full">{t('transactions.expense')}</Button>
          </div>
          <Input type="text" placeholder={t('transactions.placeholderName')} value={newTransaction.name} onChange={e => setNewTransaction({ ...newTransaction, name: e.target.value })} />
          <Input type="text" placeholder={t('transactions.placeholderCategory')} value={newTransaction.category} onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })} />
          <Input type="number" placeholder={t('transactions.placeholderAmount')} value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} />
          <Input type="date" placeholder={t('transactions.placeholderDate')} value={newTransaction.date} onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })} />
          <Button onClick={handleSaveTransaction} className="w-full">{editingTransaction ? 'Save Changes' : t('transactions.addTransaction')}</Button>
        </div>
      </Modal>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full ${active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
        {label}
        {active && <motion.div layoutId="filter-bubble" className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-lg -z-10" />}
    </button>
);

export default Transactions;
