import React, { useState } from 'react';
import { Page } from '../types';
import { LayoutDashboard, Wallet, TrendingUp, Landmark, Bot, Target, ArrowRightLeft, University, CircleDollarSign, CalendarDays, LogOut, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  handleLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobile: boolean;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  page?: Page;
  currentPage?: Page;
  onClick: () => void;
  isLogout?: boolean;
  isCollapsed: boolean;
}> = ({ icon: Icon, label, page, currentPage, onClick, isLogout = false, isCollapsed }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center w-full p-3 my-1 rounded-lg transition-all duration-200 ease-in-out group ${
        isActive
          ? 'text-[var(--text-primary)] bg-[var(--accent-primary)]/10'
          : isLogout
          ? 'text-[var(--text-secondary)] hover:text-[var(--accent-negative)] hover:bg-[var(--accent-negative)]/10'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
      } ${isCollapsed ? 'justify-center' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? label : ''}
    >
      {isActive && !isLogout && (
        <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_15px_var(--accent-primary-glow)]"></motion.div>
      )}
      <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-[var(--accent-primary)]' : ''} ${isLogout ? 'group-hover:text-[var(--accent-negative)]' : ''} ${isCollapsed ? '' : 'ml-1'}`} />
      {!isCollapsed && <span className="ml-4 font-semibold text-sm">{label}</span>}
    </button>
  );
};

const NavSection: React.FC<{ title: string; isCollapsed: boolean; children: React.ReactNode; }> = ({ title, isCollapsed, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (isCollapsed) return <div className="h-px w-8 bg-[var(--border-subtle)] my-3 mx-auto"></div>;
    
    return (
        <div>
            <button 
                className="flex items-center justify-between w-full px-4 pt-4 pb-1 text-xs font-bold uppercase text-[var(--text-secondary)] tracking-wider hover:text-[var(--text-primary)] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


const SidebarContent: React.FC<Omit<SidebarProps, 'isMobile' | 'isMobileNavOpen' | 'setIsMobileNavOpen'>> = ({ currentPage, setCurrentPage, handleLogout, isCollapsed, setIsCollapsed }) => {
    const { t } = useTranslation();
    
    const handleNavigation = (page: Page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col h-full">
            <div className={`p-4 mb-4 transition-all duration-300`}>
                <Logo isCollapsed={isCollapsed} />
            </div>
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2">
                <NavItem icon={LayoutDashboard} label={t('sidebar.dashboard')} page={Page.Dashboard} currentPage={currentPage} onClick={() => handleNavigation(Page.Dashboard)} isCollapsed={isCollapsed} />
                <NavItem icon={ArrowRightLeft} label={t('sidebar.transactions')} page={Page.Transactions} currentPage={currentPage} onClick={() => handleNavigation(Page.Transactions)} isCollapsed={isCollapsed}/>
                
                <NavSection title="Income" isCollapsed={isCollapsed}>
                    <NavItem icon={University} label={t('sidebar.accounts')} page={Page.Accounts} currentPage={currentPage} onClick={() => handleNavigation(Page.Accounts)} isCollapsed={isCollapsed} />
                    <NavItem icon={TrendingUp} label={t('sidebar.investments')} page={Page.Investments} currentPage={currentPage} onClick={() => handleNavigation(Page.Investments)} isCollapsed={isCollapsed} />
                </NavSection>

                <NavSection title="Expenses" isCollapsed={isCollapsed}>
                    <NavItem icon={CircleDollarSign} label={t('sidebar.budgets')} page={Page.Budgets} currentPage={currentPage} onClick={() => handleNavigation(Page.Budgets)} isCollapsed={isCollapsed} />
                    <NavItem icon={Landmark} label={t('sidebar.debts')} page={Page.Debts} currentPage={currentPage} onClick={() => handleNavigation(Page.Debts)} isCollapsed={isCollapsed} />
                </NavSection>

                <NavSection title="Planning" isCollapsed={isCollapsed}>
                  <NavItem icon={Target} label={t('sidebar.goals')} page={Page.Goals} currentPage={currentPage} onClick={() => handleNavigation(Page.Goals)} isCollapsed={isCollapsed} />
                  <NavItem icon={CalendarDays} label={t('sidebar.calendar')} page={Page.Calendar} currentPage={currentPage} onClick={() => handleNavigation(Page.Calendar)} isCollapsed={isCollapsed} />
                </NavSection>
                
                <NavItem icon={Bot} label={t('sidebar.aiAdvisor')} page={Page.AIAdvisor} currentPage={currentPage} onClick={() => handleNavigation(Page.AIAdvisor)} isCollapsed={isCollapsed} />
            </nav>
            <div className={`mt-auto space-y-2 pt-4 border-t border-[var(--border-subtle)] ${isCollapsed ? 'p-2' : 'p-3 md:p-4'}`}>
                <LanguageSelector isCollapsed={isCollapsed} />
                <div className="px-2">
                    <NavItem icon={LogOut} label={t('sidebar.logout')} onClick={handleLogout} isLogout={true} isCollapsed={isCollapsed} />
                </div>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, handleLogout, isCollapsed, setIsCollapsed, isMobile, isMobileNavOpen, setIsMobileNavOpen }) => {
    
    const handleNavigation = (page: Page) => {
        setCurrentPage(page);
        if (isMobile) setIsMobileNavOpen(false);
    };

    const handleLogoutAndCloseNav = () => {
        handleLogout();
        if(isMobile) setIsMobileNavOpen(false);
    }
    
    const commonProps = { currentPage, setIsCollapsed };

    if (isMobile) {
        return (
             <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-30 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileNavOpen(false)}
                        />
                        <motion.aside
                            className="fixed top-0 left-0 h-full w-64 bg-[var(--surface-primary)] border-r border-[var(--border-subtle)] flex flex-col z-40"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                        >
                           <SidebarContent {...commonProps} isCollapsed={false} setCurrentPage={handleNavigation} handleLogout={handleLogoutAndCloseNav} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <aside className={`fixed top-0 left-0 h-full bg-[var(--surface-secondary)] flex-col transition-all duration-300 z-20 hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <SidebarContent {...commonProps} isCollapsed={isCollapsed} setCurrentPage={handleNavigation} handleLogout={handleLogoutAndCloseNav} />
             {!isMobile && (
                <div className="p-3 border-t border-[var(--border-subtle)]">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex justify-center items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                    </button>
                </div>
             )}
        </aside>
    );
};

export default Sidebar;