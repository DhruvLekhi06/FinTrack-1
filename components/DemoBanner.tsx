import React from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';

interface DemoBannerProps {
  onExit: () => void;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ onExit }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] z-50 flex items-center justify-center px-4 text-white shadow-lg demo-banner">
      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold">
          You are currently in <span className="font-extrabold tracking-wider">DEMO MODE</span>. All data is for demonstration purposes only.
        </p>
        <Button onClick={onExit} variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
          <X className="mr-1 h-3 w-3" />
          Exit Demo
        </Button>
      </div>
    </div>
  );
};

export default DemoBanner;