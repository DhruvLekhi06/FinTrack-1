import React, { useState } from 'react';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

interface LoginProps {
  onLogin: (email: string, password_hash: string) => Promise<void>;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignUp, onForgotPassword, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, you'd hash the password. This is not secure.
    const password_hash = `hashed_${password}`;
    await onLogin(email, password_hash);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthLayout 
        headline="Welcome back."
        subheadline="Log in to your FinTrack account to continue managing your finances."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-3 rounded-lg">{error}</p>}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="space-y-1">
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div className="text-right">
                  <button type="button" onClick={onForgotPassword} className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:underline">
                      Forgot Password?
                  </button>
              </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Log In'}
          </Button>
          <p className="text-center text-sm text-[var(--text-secondary)] pt-4">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitchToSignUp} className="font-semibold text-[var(--accent-primary)] hover:underline">
              Sign Up
            </button>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
};

export default Login;