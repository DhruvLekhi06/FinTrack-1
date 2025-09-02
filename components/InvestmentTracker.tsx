import React, { useState, useEffect } from 'react';
import type { SIP, FixedDeposit, Stock } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

interface InvestmentTrackerProps {
  sips: SIP[];
  fds: FixedDeposit[];
  stocks: Stock[];
  addSip: (sip: Omit<SIP, 'id'>) => void;
  updateSip: (sip: SIP) => void;
  deleteSip: (id: string) => void;
  addFd: (fd: Omit<FixedDeposit, 'id'>) => void;
  updateFd: (fd: FixedDeposit) => void;
  deleteFd: (id: string) => void;
  addStock: (stock: Omit<Stock, 'id'>) => void;
  updateStock: (stock: Stock) => void;
  deleteStock: (id: string) => void;
  isMobile: boolean;
  isDemoMode?: boolean;
}

type Tab = 'stocks' | 'sips' | 'fds';
type EditingItem = Stock | SIP | FixedDeposit | null;

const InvestmentTracker: React.FC<InvestmentTrackerProps> = (props) => {
  const { sips, fds, stocks, addSip, updateSip, deleteSip, addFd, updateFd, deleteFd, addStock, updateStock, deleteStock, isMobile, isDemoMode } = props;
  const [activeTab, setActiveTab] = useState<Tab>('stocks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const { t } = useTranslation();
  
  const [sipForm, setSipForm] = useState({ fundName: '', monthlyAmount: '', startDate: '' });
  const [fdForm, setFdForm] = useState({ bankName: '', principal: '', interestRate: '', maturityDate: '' });
  const [stockForm, setStockForm] = useState({ ticker: '', companyName: '', shares: '', purchasePrice: '', currentPrice: '' });

  useEffect(() => {
    if (editingItem) {
        if ('fundName' in editingItem) { // SIP
            setSipForm({ ...editingItem, monthlyAmount: String(editingItem.monthlyAmount) });
        } else if ('bankName' in editingItem) { // FD
            setFdForm({ ...editingItem, principal: String(editingItem.principal), interestRate: String(editingItem.interestRate) });
        } else if ('ticker' in editingItem) { // Stock
            setStockForm({ ...editingItem, shares: String(editingItem.shares), purchasePrice: String(editingItem.purchasePrice), currentPrice: String(editingItem.currentPrice) });
        }
    } else {
        setSipForm({ fundName: '', monthlyAmount: '', startDate: '' });
        setFdForm({ bankName: '', principal: '', interestRate: '', maturityDate: '' });
        setStockForm({ ticker: '', companyName: '', shares: '', purchasePrice: '', currentPrice: '' });
    }
  }, [editingItem, isModalOpen]);
  
  const handleModalOpen = (item: EditingItem = null) => {
      setEditingItem(item);
      setIsModalOpen(true);
  };
  const handleModalClose = () => setIsModalOpen(false);

  const handleSave = () => {
      switch(activeTab) {
          case 'sips':
              if(sipForm.fundName && sipForm.monthlyAmount && sipForm.startDate) {
                const data = { ...sipForm, monthlyAmount: parseFloat(sipForm.monthlyAmount) };
                if (editingItem) updateSip({ ...data, id: editingItem.id }); else addSip(data);
                handleModalClose();
              }
              break;
          case 'fds':
              if(fdForm.bankName && fdForm.principal && fdForm.interestRate && fdForm.maturityDate) {
                const data = { ...fdForm, principal: parseFloat(fdForm.principal), interestRate: parseFloat(fdForm.interestRate) };
                if (editingItem) updateFd({ ...data, id: editingItem.id }); else addFd(data);
                handleModalClose();
              }
              break;
          case 'stocks':
              if(stockForm.ticker && stockForm.companyName && stockForm.shares && stockForm.purchasePrice && stockForm.currentPrice) {
                const data = { ...stockForm, shares: parseInt(stockForm.shares), purchasePrice: parseFloat(stockForm.purchasePrice), currentPrice: parseFloat(stockForm.currentPrice) };
                if (editingItem) updateStock({ ...data, id: editingItem.id }); else addStock(data);
                handleModalClose();
              }
              break;
      }
  };

  const renderModalContent = () => {
    switch(activeTab) {
      case 'sips':
        return (
          <div className="space-y-4">
            <Input placeholder={t('investments.modal.fundNamePlaceholder')} value={sipForm.fundName} onChange={e => setSipForm({...sipForm, fundName: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.monthlyAmountPlaceholder')} value={sipForm.monthlyAmount} onChange={e => setSipForm({...sipForm, monthlyAmount: e.target.value})} />
            <Input type="date" placeholder={t('investments.modal.startDatePlaceholder')} value={sipForm.startDate} onChange={e => setSipForm({...sipForm, startDate: e.target.value})} />
          </div>
        );
      case 'fds':
        return (
          <div className="space-y-4">
            <Input placeholder={t('investments.modal.bankNamePlaceholder')} value={fdForm.bankName} onChange={e => setFdForm({...fdForm, bankName: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.principalPlaceholder')} value={fdForm.principal} onChange={e => setFdForm({...fdForm, principal: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.interestRatePlaceholder')} value={fdForm.interestRate} onChange={e => setFdForm({...fdForm, interestRate: e.target.value})} />
            <Input type="date" placeholder={t('investments.modal.maturityDatePlaceholder')} value={fdForm.maturityDate} onChange={e => setFdForm({...fdForm, maturityDate: e.target.value})} />
          </div>
        );
      case 'stocks':
        return (
          <div className="space-y-4">
            <Input placeholder={t('investments.modal.tickerPlaceholder')} value={stockForm.ticker} onChange={e => setStockForm({...stockForm, ticker: e.target.value})} />
            <Input placeholder={t('investments.modal.companyNamePlaceholder')} value={stockForm.companyName} onChange={e => setStockForm({...stockForm, companyName: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.sharesPlaceholder')} value={stockForm.shares} onChange={e => setStockForm({...stockForm, shares: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.purchasePricePlaceholder')} value={stockForm.purchasePrice} onChange={e => setStockForm({...stockForm, purchasePrice: e.target.value})} />
            <Input type="number" placeholder={t('investments.modal.currentPricePlaceholder')} value={stockForm.currentPrice} onChange={e => setStockForm({...stockForm, currentPrice: e.target.value})} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('investments.title')}</h1>
        <Button onClick={() => handleModalOpen()} disabled={isDemoMode}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add {activeTab.slice(0, -1)}
        </Button>
      </div>

      <div className="flex space-x-2 border-b-2 border-[var(--border-subtle)]">
        <TabButton name={t('investments.tabs.stocks')} tab="stocks" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name={t('investments.tabs.sips')} tab="sips" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name={t('investments.tabs.fds')} tab="fds" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'stocks' && <StockList stocks={stocks} onEdit={handleModalOpen} onDelete={deleteStock} isMobile={isMobile} />}
                {activeTab === 'sips' && <SipList sips={sips} onEdit={handleModalOpen} onDelete={deleteSip} isMobile={isMobile} />}
                {activeTab === 'fds' && <FdList fds={fds} onEdit={handleModalOpen} onDelete={deleteFd} isMobile={isMobile} />}
            </motion.div>
        </AnimatePresence>
      
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={(editingItem ? "Edit" : "Add") + ` ${activeTab.slice(0, -1)}`}>
        {renderModalContent()}
        <Button onClick={handleSave} className="w-full mt-4">{editingItem ? "Save Changes" : "Add Investment"}</Button>
      </Modal>
    </div>
  );
};

const TabButton: React.FC<{name: string, tab: Tab, activeTab: Tab, setActiveTab: (tab: Tab) => void}> = ({ name, tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
      activeTab === tab
        ? 'text-[var(--text-primary)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`}
  >
    {name}
    {activeTab === tab && <motion.div layoutId="underline" className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary-glow)]"></motion.div>}
  </button>
);

const thClasses = "p-4 text-left font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-sm";
const tdClasses = "p-4";

const renderRow = (children: React.ReactNode, id: string) => (
  <motion.tr 
    key={id}
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    className="border-b border-[var(--border-subtle)] last:border-b-0"
  >
    {children}
  </motion.tr>
);

const CrudActions: React.FC<{ onEdit: () => void; onDelete: () => void; className?: string }> = ({ onEdit, onDelete, className }) => (
    <div className={`flex justify-end items-center gap-2 ${className}`}>
      <button onClick={onEdit} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Edit size={16} /></button>
      <button onClick={onDelete} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-negative)] transition-colors rounded-md hover:bg-[var(--surface-secondary)]"><Trash2 size={16} /></button>
    </div>
);

// Stock List / Cards
const StockCard: React.FC<{stock: Stock, onEdit: (s: Stock) => void, onDelete: (id: string) => void}> = ({stock, onEdit, onDelete}) => {
    const totalValue = stock.shares * stock.currentPrice;
    const totalCost = stock.shares * stock.purchasePrice;
    const gainLoss = totalValue - totalCost;
    const isGain = gainLoss >= 0;

    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale:0.8 }}>
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-[var(--text-primary)]">{stock.companyName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{stock.ticker} &bull; {stock.shares} Shares</p>
                </div>
                <p className={`font-bold text-lg ${isGain ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>{isGain ? '+' : ''}₹{gainLoss.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                    <p className="text-sm text-[var(--text-secondary)]">Total Value</p>
                    <p className="font-bold text-xl text-[var(--text-primary)]">₹{totalValue.toLocaleString('en-IN')}</p>
                </div>
                <CrudActions onEdit={() => onEdit(stock)} onDelete={() => onDelete(stock.id)} />
            </div>
        </Card>
        </motion.div>
    );
}
const StockList: React.FC<{ stocks: Stock[]; onEdit: (item: Stock) => void; onDelete: (id: string) => void; isMobile: boolean; }> = ({ stocks, onEdit, onDelete, isMobile }) => {
  const { t } = useTranslation();
  if (isMobile) {
      return (
          <div className="space-y-4">
              <AnimatePresence>
                {stocks.map(s => <StockCard key={s.id} stock={s} onEdit={onEdit} onDelete={onDelete} />)}
              </AnimatePresence>
          </div>
      );
  }
  return (
  <Card className="overflow-x-auto p-0">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className={thClasses}>{t('investments.stocksTable.company')}</th>
          <th className={thClasses}>{t('investments.stocksTable.shares')}</th>
          <th className={`${thClasses} text-right`}>{t('investments.stocksTable.totalValue')}</th>
          <th className={`${thClasses} text-right`}>{t('investments.stocksTable.gainLoss')}</th>
          <th className={`${thClasses} text-right`}>Actions</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
        {stocks.map(s => {
          const totalValue = s.shares * s.currentPrice;
          const totalCost = s.shares * s.purchasePrice;
          const gainLoss = totalValue - totalCost;
          const isGain = gainLoss >= 0;
          return renderRow(
            <>
              <td className={`${tdClasses} font-semibold text-[var(--text-primary)]`}>{s.companyName} <span className="text-xs text-[var(--text-secondary)]">{s.ticker}</span></td>
              <td className={`${tdClasses} text-[var(--text-secondary)]`}>{s.shares}</td>
              <td className={`${tdClasses} font-semibold text-[var(--text-primary)] text-right`}>₹{totalValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              <td className={`${tdClasses} font-semibold text-right ${isGain ? 'text-[var(--accent-positive)]' : 'text-[var(--accent-negative)]'}`}>{isGain ? '+' : ''}₹{gainLoss.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              <td className={`${tdClasses} text-right`}><CrudActions onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} /></td>
            </>,
            s.id
          );
        })}
        </AnimatePresence>
      </tbody>
    </table>
  </Card>
)};


// SIP List / Cards
const SipCard: React.FC<{sip: SIP, onEdit: (s: SIP) => void, onDelete: (id: string) => void}> = ({sip, onEdit, onDelete}) => (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale:0.8 }}>
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-[var(--text-primary)]">{sip.fundName}</p>
                <p className="text-sm text-[var(--text-secondary)]">Started: {sip.startDate}</p>
            </div>
            <CrudActions onEdit={() => onEdit(sip)} onDelete={() => onDelete(sip.id)} />
        </div>
        <div className="text-right mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-sm text-[var(--text-secondary)]">Monthly Amount</p>
            <p className="font-bold text-xl text-[var(--accent-primary)]">₹{sip.monthlyAmount.toLocaleString('en-IN')}</p>
        </div>
    </Card>
    </motion.div>
);
const SipList: React.FC<{ sips: SIP[]; onEdit: (item: SIP) => void; onDelete: (id: string) => void; isMobile: boolean; }> = ({ sips, onEdit, onDelete, isMobile }) => {
  const { t } = useTranslation();
  if(isMobile) {
      return (
          <div className="space-y-4">
              <AnimatePresence>
                {sips.map(s => <SipCard key={s.id} sip={s} onEdit={onEdit} onDelete={onDelete} />)}
              </AnimatePresence>
          </div>
      );
  }
  return (
   <Card className="overflow-x-auto p-0">
    <table className="min-w-full">
        <thead>
            <tr>
                <th className={thClasses}>{t('investments.sipsTable.fundName')}</th>
                <th className={`${thClasses} text-right`}>{t('investments.sipsTable.monthlyAmount')}</th>
                <th className={thClasses}>{t('investments.sipsTable.startDate')}</th>
                <th className={`${thClasses} text-right`}>Actions</th>
            </tr>
        </thead>
        <tbody>
            <AnimatePresence>
            {sips.map(s => renderRow(
                <>
                    <td className={`${tdClasses} font-semibold text-[var(--text-primary)]`}>{s.fundName}</td>
                    <td className={`${tdClasses} text-[var(--text-primary)] text-right`}>₹{s.monthlyAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className={`${tdClasses} text-[var(--text-secondary)]`}>{s.startDate}</td>
                    <td className={`${tdClasses} text-right`}><CrudActions onEdit={() => onEdit(s)} onDelete={() => onDelete(s.id)} /></td>
                </>,
                s.id
            ))}
            </AnimatePresence>
        </tbody>
    </table>
   </Card>
)};


// FD List / Cards
const FdCard: React.FC<{fd: FixedDeposit, onEdit: (f: FixedDeposit) => void, onDelete: (id: string) => void}> = ({fd, onEdit, onDelete}) => (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale:0.8 }}>
    <Card>
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-[var(--text-primary)]">{fd.bankName}</p>
                <p className="text-sm text-[var(--text-secondary)]">Matures: {fd.maturityDate}</p>
            </div>
            <CrudActions onEdit={() => onEdit(fd)} onDelete={() => onDelete(fd.id)} />
        </div>
        <div className="flex justify-between items-end mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <div>
                <p className="text-sm text-[var(--text-secondary)]">Principal</p>
                <p className="font-bold text-xl text-[var(--text-primary)]">₹{fd.principal.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-[var(--text-secondary)]">Interest Rate</p>
                <p className="font-bold text-xl text-[var(--accent-positive)]">{fd.interestRate.toFixed(2)}%</p>
            </div>
        </div>
    </Card>
    </motion.div>
);
const FdList: React.FC<{ fds: FixedDeposit[]; onEdit: (item: FixedDeposit) => void; onDelete: (id: string) => void; isMobile: boolean; }> = ({ fds, onEdit, onDelete, isMobile }) => {
  const { t } = useTranslation();
  if(isMobile) {
      return (
          <div className="space-y-4">
              <AnimatePresence>
                {fds.map(f => <FdCard key={f.id} fd={f} onEdit={onEdit} onDelete={onDelete} />)}
              </AnimatePresence>
          </div>
      );
  }
  return (
    <Card className="overflow-x-auto p-0">
    <table className="min-w-full">
        <thead>
            <tr>
                <th className={thClasses}>{t('investments.fdsTable.bank')}</th>
                <th className={`${thClasses} text-right`}>{t('investments.fdsTable.principal')}</th>
                <th className={`${thClasses} text-right`}>{t('investments.fdsTable.interestRate')}</th>
                <th className={thClasses}>{t('investments.fdsTable.maturityDate')}</th>
                <th className={`${thClasses} text-right`}>Actions</th>
            </tr>
        </thead>
        <tbody>
            <AnimatePresence>
            {fds.map(f => renderRow(
                <>
                    <td className={`${tdClasses} font-semibold text-[var(--text-primary)]`}>{f.bankName}</td>
                    <td className={`${tdClasses} text-[var(--text-primary)] text-right`}>₹{f.principal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className={`${tdClasses} text-[var(--accent-positive)] text-right`}>{f.interestRate.toFixed(2)}%</td>
                    <td className={`${tdClasses} text-[var(--text-secondary)]`}>{f.maturityDate}</td>
                    <td className={`${tdClasses} text-right`}><CrudActions onEdit={() => onEdit(f)} onDelete={() => onDelete(f.id)} /></td>
                </>,
                f.id
            ))}
            </AnimatePresence>
        </tbody>
    </table>
    </Card>
)};

export default InvestmentTracker;
