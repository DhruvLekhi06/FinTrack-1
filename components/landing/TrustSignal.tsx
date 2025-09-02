import React from 'react';
import { LucideProps } from 'lucide-react';

interface TrustSignalProps {
  icon: React.ElementType<LucideProps>;
  text: string;
}

const TrustSignal: React.FC<TrustSignalProps> = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
      <Icon className="h-6 w-6 text-[var(--accent-primary)]" />
      <span className="font-semibold font-sans text-sm">{text}</span>
    </div>
  );
};

export default TrustSignal;