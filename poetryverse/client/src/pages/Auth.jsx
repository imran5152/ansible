import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { SimpleNav, Footer, Message } from '../components';

export default function Auth({ signup = false }) {
  const { user, setUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setError(''); setSuccess(''); setBusy(true);
    try {
      const result = await api(signup ? '/auth/register' : '/auth/login', { method: 'POST', body });
      if (signup) { setSuccess(result.message); form.reset(); }
      else { setUser(result.user); navigate(location.state?.from || '/dashboard', { replace: true }); }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className={signup ? 'page-signup' : 'page-login'}>
    <SimpleNav />
    <main><div className="layout">
      <section className="welcome">
        <span className="eyebrow">{signup ? 'A home for your words' : 'Welcome back, poet'}</span>
        <h1>{signup ? 'Every soul has a story.' : 'Your words are waiting for you.'}</h1>
        <p>{signup ? "Some feelings become memories. Some become poems. Create your account and begin your own little corner of PoetryVerse." : 'Return to the quiet place where your thoughts become poems and your feelings find their words.'}</p>
        <div className="flower" aria-hidden="true">{signup ? '✿' : '❀'}</div>
        <p><em>{signup ? '“Let your words bloom.”' : 'Every poem begins with a feeling.'}</em></p>
      </section>
      <section className="form-card">
        <h2>{signup ? 'Create your account' : 'Welcome back.'}</h2>
        <p className="intro">{signup ? "A few little details, and you're in." : 'Sign in to continue your story.'}</p>
        <Message error>{error}</Message>
        <Message>{success && <>{success} <Link to="/login">Log in →</Link></>}</Message>
        <form onSubmit={submit}>
          {signup && <><label htmlFor="name">Your name</label><input id="name" name="name" maxLength={100} autoComplete="name" placeholder="What should we call you?" required /></>}
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" name="email" autoComplete="email" maxLength={255} placeholder="you@example.com" required />
          <label htmlFor="password">{signup ? 'Create a password' : 'Password'}</label>
          <input type="password" id="password" name="password" autoComplete={signup ? 'new-password' : 'current-password'} minLength={signup ? 8 : 1} maxLength={signup ? 72 : 1024} placeholder={signup ? 'At least 8 characters' : 'Enter your password'} required />
          {signup && <><label htmlFor="confirmPassword">Confirm password</label><input type="password" id="confirmPassword" name="confirmPassword" minLength={8} maxLength={72} autoComplete="new-password" placeholder="Enter your password again" required /></>}
          <button type="submit" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create my account ♡' : 'Log in to PoetryVerse ♡'}</button>
        </form>
        {signup && <p className="privacy">Your password is hashed before storage. Never share your password with anyone.</p>}
        <div className="bottom">{signup ? 'Already have an account?' : 'New to PoetryVerse?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Log in' : 'Create an account'}</Link></div>
      </section>
    </div></main>
    <Footer />
  </div>;
}
