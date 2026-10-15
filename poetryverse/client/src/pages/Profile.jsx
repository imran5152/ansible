import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { SiteHeader, Footer, Message, initials } from '../components';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setSaved(false); setBusy(true);
    try { const result = await api('/profile', { method: 'PATCH', body: { name, bio } }); setUser(result.user); setSaved(true); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="page-profile"><SiteHeader profile />
    <main className="profile-page"><div className="profile-card">
      <div className="eyebrow">A little about the poet</div><h1>My Profile</h1>
      <div className="avatar">{initials(user.name)}</div><h2>{user.name}</h2><p>{user.email}</p>
      {saved && <p className="notice" role="status">Your profile has been updated. ♡</p>}
      <Message error>{error}</Message>
      <form onSubmit={submit}>
        <label htmlFor="name">Display name</label><input id="name" name="name" maxLength={100} required value={name} onChange={e => { setName(e.target.value); setSaved(false); }} />
        <label htmlFor="bio">Your bio</label><textarea id="bio" name="bio" maxLength={500} placeholder="Tell the world what inspires your words..." value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }} />
        <p><small>{bio.length} / 500 characters</small></p>
        <button className="button" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile ♡'}</button>
      </form>
      <div className="profile-links"><Link className="button" to="/my-poems">Read my poems</Link><Link className="button" to="/write">Write a poem</Link></div>
    </div></main><Footer>Your story deserves a place to bloom. ♡</Footer>
  </div>;
}
