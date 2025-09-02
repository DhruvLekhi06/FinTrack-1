import React, { useState } from 'react';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';

interface ForgotPasswordProps {
  onForgotPasswordRequest: (email: string) => Promise<{ success: boolean; message: string; token?: string }>;
  onSwitchToLogin: () => void;
  onSwitchToReset: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onForgotPasswordRequest, onSwitchToLogin, onSwitchToReset }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const result = await onForgotPasswordRequest(email);
    setIsLoading(false);
    
    if (result.success && result.token) {
        setResetToken(result.token);
        setShowTokenModal(true);
    } else {
        // Show the generic "If email exists..." message to prevent email enumeration
        setMessage("If an account with this email exists, a password reset link has been sent.");
    }
  };
  
  const handleProceedToReset = () => {
    setShowTokenModal(false);
    onSwitchToReset();
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
    <AuthLayout
      headline="Forgot Password?"
      subheadline="No problem. Enter your email address and we'll send you a link to get back into your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        {message && !showTokenModal && <p className="text-emerald-400 text-sm text-center bg-emerald-500/10 p-3 rounded-lg">{message}</p>}
        <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Send Reset Link'}
        </Button>
        <p className="text-center text-sm text-[var(--text-secondary)] pt-4">
          Remember your password?{' '}
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[var(--accent-primary)] hover:underline">
            Log In
          </button>
        </p>
      </form>

       <Modal isOpen={showTokenModal} onClose={() => setShowTokenModal(false)} title="Password Reset Token">
            <div className="space-y-4 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                    Because this is a demo application without a backend, we can't email you the reset link.
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                    Please copy the token below and use it on the next screen to reset your password.
                </p>
                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg">
                    <p className="font-mono text-sm text-[var(--accent-primary)] break-all">{resetToken}</p>
                </div>
                 <Button onClick={handleProceedToReset} className="w-full">
                    Proceed to Reset Password
                </Button>
            </div>
        </Modal>
    </AuthLayout>
    </div>
  );
};

export default ForgotPassword;