import React, { useState } from 'react';
import AuthLayout from '../components/ui/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

interface ResetPasswordProps {
  onResetPassword: (token: string, new_password_hash: string) => Promise<{ success: boolean; message: string; }>;
  onSwitchToLogin: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onResetPassword, onSwitchToLogin }) => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    // In a real app, you'd hash the password. This is not secure.
    const new_password_hash = `hashed_${password}`; 
    const result = await onResetPassword(token, new_password_hash);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => onSwitchToLogin(), 3000); // Redirect to login after 3 seconds
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
    <AuthLayout
      headline="Create a new password"
      subheadline="Your new password must be different from previous used passwords."
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-3 rounded-lg">{error}</p>}
        {successMessage && <p className="text-emerald-400 text-sm text-center mb-4 bg-emerald-500/10 p-3 rounded-lg">{successMessage}</p>}
        
        <Input type="text" placeholder="Paste your reset token here" value={token} onChange={(e) => setToken(e.target.value)} required />
        <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        
        <Button type="submit" size="lg" className="w-full" disabled={isLoading || !!successMessage}>
          {isLoading ? <Spinner /> : 'Reset Password'}
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] pt-4">
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[var(--accent-primary)] hover:underline">
            Back to Login
          </button>
        </p>
      </form>
    </AuthLayout>
    </div>
  );
};

export default ResetPassword;