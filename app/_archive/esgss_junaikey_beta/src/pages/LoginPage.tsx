import { useState, useEffect } from 'react';
import NCBAuth from '../components/NCBAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/ncb/auth/session', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user || data.email) {
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <NCBAuth mode="signin" onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}
