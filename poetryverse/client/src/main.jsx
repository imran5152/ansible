import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, Protected } from './auth';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Write from './pages/Write';
import Profile from './pages/Profile';
import Poems from './pages/Poems';
import './styles.css';

const aliases = { '/index.php': '/', '/index.html': '/', '/login.php': '/login', '/signup.php': '/signup', '/dashboard.php': '/dashboard', '/write.php': '/write', '/profile.php': '/profile', '/mypoems.php': '/my-poems', '/my_poems.php': '/my-poems', '/poem.php': '/poem', '/poems.php': '/my-poems' };
const titles = { '/': 'PoetryVerse — A little world of words', '/login': 'Log In | PoetryVerse', '/signup': 'Sign Up | PoetryVerse', '/dashboard': "My PoetryVerse | Writer's Corner", '/write': 'Write a Poem | PoetryVerse', '/profile': 'My Profile | PoetryVerse', '/my-poems': 'My Poems | PoetryVerse', '/poem': 'My Poems | PoetryVerse' };
function App() {
  const location = useLocation();
  useEffect(() => {
    document.title = titles[location.pathname] || 'PoetryVerse';
    if (location.hash) {
      const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Auth key="login" />} />
    <Route path="/signup" element={<Auth key="signup" signup />} />
    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    <Route path="/profile" element={<Protected><Profile /></Protected>} />
    <Route path="/write" element={<Protected><Write /></Protected>} />
    <Route path="/my-poems" element={<Protected><Poems key="my-poems" /></Protected>} />
    <Route path="/poem" element={<Protected><Poems key="poem" legacy /></Protected>} />
    {Object.entries(aliases).map(([from, to]) => <Route key={from} path={from} element={<Navigate to={`${to}${location.search}${location.hash}`} replace />} />)}
    <Route path="*" element={<main className="system-message"><h1>This page wandered away.</h1><Link to="/">Return to PoetryVerse</Link></main>} />
  </Routes>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>);
