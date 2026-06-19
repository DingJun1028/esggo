import { useState, useEffect } from 'react';

interface NCBAuthProps {
  mode?: 'signin' | 'signup';
  onAuthSuccess?: (data: any) => void;
  onAuthError?: (error: Error) => void;
}

const API_BASE = '';

export default function NCBAuth({ mode = 'signin', onAuthSuccess, onAuthError }: NCBAuthProps) {
  const [currentView, setCurrentView] = useState<'signin' | 'signup' | 'otp'>(mode);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ncb/auth/session`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user || data.email) {
          setSession(data);
          onAuthSuccess?.(data);
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/ncb/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign in failed');
      setSession(data.user || data);
      onAuthSuccess?.(data);
    } catch (err: any) {
      setError(err.message);
      onAuthError?.(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/ncb/auth/sign-up/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign up failed');
      setSession(data.user || data);
      onAuthSuccess?.(data);
    } catch (err: any) {
      setError(err.message);
      onAuthError?.(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${API_BASE}/api/ncb/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setSession(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (session?.user || session?.email) {
    return (
      <div style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {(session.user?.name || session.name || session.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.profileName}>{session.user?.name || session.name || 'User'}</h2>
            <p style={styles.profileEmail}>{session.user?.email || session.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} style={styles.signOutBtn}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{currentView === 'signin' ? 'Sign In' : 'Create Account'}</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={currentView === 'signin' ? handleEmailSignIn : handleEmailSignUp}>
        {currentView === 'signup' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" disabled={formLoading} style={styles.primaryBtn}>
          {formLoading ? 'Loading...' : currentView === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p style={styles.toggleText}>
        {currentView === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setCurrentView(currentView === 'signin' ? 'signup' : 'signin')}
          style={styles.toggleBtn}
        >
          {currentView === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  error: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    color: '#fca5a5',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#fff',
    boxSizing: 'border-box',
  },
  primaryBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#06b6d4',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginTop: '1rem',
  },
  toggleBtn: {
    color: '#06b6d4',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#06b6d4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  loadingText: {
    color: '#94a3b8',
    textAlign: 'center',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '4rem',
    height: '4rem',
    backgroundColor: '#06b6d4',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: 0,
  },
  profileEmail: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0,
  },
  signOutBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
};
