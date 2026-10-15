import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  async function refresh() {
    setError('');
    try { const data = await api('/auth/session'); setUser(data.user); setReady(true); }
    catch (err) { setError(err.message); }
  }
  useEffect(() => { refresh(); }, []);
  if (error) return <main className="system-message"><h1>PoetryVerse</h1><p role="alert">{error}</p><button onClick={refresh}>Try again</button></main>;
  if (!ready) return <p className="system-message" role="status">Opening your little world of words…</p>;
  return <AuthContext.Provider value={{ user, setUser, refresh }}>{children}</AuthContext.Provider>;
}
export function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}
