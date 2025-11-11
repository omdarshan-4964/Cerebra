import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: Props) {
  const { signIn, signUp, loading, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await signUp(email, password, name || undefined);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border">
        <h3 className="text-lg font-bold mb-2">{isSignUp ? 'Create an account' : 'Sign in'}</h3>
        <p className="text-sm text-gray-600 mb-4">{isSignUp ? 'Start saving maps and managing your progress.' : 'Access saved maps and personalized features.'}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-4 py-3 border rounded-md" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 border rounded-md" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-3 border rounded-md" />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between gap-2">
            <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSignUp ? 'Create account' : 'Sign in'}
            </button>
            <button type="button" className="text-sm text-gray-600 underline" onClick={() => setIsSignUp((s) => !s)}>
              {isSignUp ? 'Have an account? Sign in' : 'New here? Create account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">This demo stores user data in-memory only for the session.</div>
      </div>
    </div>
  );
}
