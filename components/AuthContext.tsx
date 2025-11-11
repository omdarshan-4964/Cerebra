import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string; // initials
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error?: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name?: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// NOTE: This is an in-memory demo auth provider. It does NOT persist across reloads
// and is intended for local/demo usage only (per project constraint: no localStorage/sessionStorage for user data).
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simple in-memory user store (email -> {password, user})
  const store = useRef(new Map<string, { password: string; user: User }>());

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 400)); // fake delay

    const entry = store.current.get(email.toLowerCase());
    if (!entry || entry.password !== password) {
      const msg = 'Invalid email or password';
      setError(msg);
      setLoading(false);
      return Promise.reject(new Error(msg));
    }
    setUser(entry.user);
    setLoading(false);
    return Promise.resolve(entry.user);
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 600)); // fake delay

    const key = email.toLowerCase();
    if (store.current.has(key)) {
      const msg = 'User already exists';
      setError(msg);
      setLoading(false);
      return Promise.reject(new Error(msg));
    }

    const id = `u_${Date.now().toString(36)}`;
    const avatar = (name || email.split('@')[0] || 'U')
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    const newUser: User = { id, email: key, name: name || undefined, avatar };
    store.current.set(key, { password, user: newUser });
    setUser(newUser);
    setLoading(false);
    return Promise.resolve(newUser);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
