import React from 'react';
import { Menu } from 'lucide-react';
import { Page } from '../types';

interface MobileHeaderProps {
  onMenuClick: () => void;
  currentPage: Page;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, currentPage }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--surface-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] z-30 flex items-center justify-between px-4 md:hidden">
      <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{currentPage}</h1>
      <button onClick={onMenuClick} className="p-2 text-[var(--text-primary)] rounded-full hover:bg-white/10 transition-colors">
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
};

export default MobileHeader;
