import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Logo from './Logo';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (name: string, email: string, password_hash: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string | null;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSignUp, onSwitchToLogin, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const password_hash = `hashed_${password}`;
    await onSignUp(name, email, password_hash);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <div className="absolute inset-0 animated-particle-bg" />
            
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20 rounded-full p-1 hover:bg-white/10"
                aria-label="Close modal"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="relative p-8 z-10 glass-card">
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                     <Logo />
                </div>
                <h2 className="text-2xl font-bold text-white">Create your account</h2>
                <p className="text-sm text-white/80 mt-1" style={{fontWeight: 400}}>Join FinTrack to manage your finances.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">{error}</p>}
                <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{fontWeight: 400}}/>
                <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{fontWeight: 400}}/>
                <Input type="password" placeholder="Create a Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{fontWeight: 400}}/>
                <Button type="submit" size="lg" className="w-full button-glow" disabled={isLoading}>
                  {isLoading ? <Spinner /> : 'Open Account'}
                </Button>
                <p className="text-center text-sm text-white/80 pt-4" style={{fontWeight: 400}}>
                  Already have an account?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="font-bold text-white hover:underline">
                    Log In
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;