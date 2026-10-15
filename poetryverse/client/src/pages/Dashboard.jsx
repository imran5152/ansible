import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { Footer, initials, Message } from '../components';

export default function Dashboard() {
  const { user, setUser, refresh } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function logout() {
    setBusy(true); setError('');
    try { await api('/auth/logout', { method: 'POST' }); setUser(null); await refresh(); navigate('/'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="page-dashboard">
    <nav className="navbar"><Link className="brand" to="/">PoetryVerse ✿</Link><div className="nav-links"><Link to="/">Home</Link><Link to="/write">Write</Link><Link to="/profile" aria-label="Your profile"><div className="profile-mini">{initials(user.name)}</div></Link></div></nav>
    <main>
      <section className="dashboard-cards">
        <Link to="/profile" className="dashboard-card"><h2>♡ My Profile</h2><p>Make your PoetryVerse profile your own.</p><span>Edit Profile →</span></Link>
        <Link to="/my-poems" className="dashboard-card"><h2>✍ My Poems</h2><p>Visit your collection of saved poems.</p><span>View My Poems →</span></Link>
        <Link to="/write" className="dashboard-card"><h2>＋ Write a Poem</h2><p>Turn your thoughts and feelings into poetry.</p><span>Start Writing →</span></Link>
      </section>
      <section className="welcome"><div><div className="eyebrow">Your little corner of poetry</div><h1>Hello, {user.name}. 🌷</h1><p>Every heart holds a thousand unwritten words. Welcome back to your creative space. Take a breath, find your inspiration, and let your words bloom.</p><Link className="button" to="/write">＋ Write a poem</Link></div><div className="avatar-large" aria-label="Your profile initials">{initials(user.name)}</div></section>
      <div className="section-heading"><div className="eyebrow">Make yourself at home</div><h2>Your writer's corner</h2></div>
      <section className="grid">
        <Link className="card" to="/write"><div className="card-icon">✍️</div><h3>Write a poem</h3><p>Turn a feeling, a memory, or a passing thought into words.</p></Link>
        <Link className="card" to="/"><div className="card-icon">📖</div><h3>Explore Poetry</h3><p>Return to PoetryVerse and find inspiration for your next verse.</p></Link>
        <a className="card" href="#account"><div className="card-icon">🌷</div><h3>Your profile</h3><p>See your account details and make this space your own.</p></a>
      </section>
      <section className="account" id="account"><div><div className="eyebrow">Account details</div><h3>{user.name}</h3><p>{user.email}</p></div><button className="logout" onClick={logout} disabled={busy}>{busy ? 'Logging out…' : 'Log out ↗'}</button></section>
      <Message error>{error}</Message>
    </main>
    <Footer>Made with love, for the words that live within us. ♡</Footer>
  </div>;
}
