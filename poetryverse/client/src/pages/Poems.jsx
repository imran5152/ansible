import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { SiteHeader, Footer, Message } from '../components';

export default function Poems({ legacy = false }) {
  const { user } = useAuth();
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [params] = useSearchParams();
  const [notice, setNotice] = useState(params.has('saved') ? 'Your poem has been saved successfully. ♡' : '');
  async function load(signal) {
    setLoading(true); setError('');
    try { const data = await api('/poems', { signal }); setPoems(data.poems); }
    catch (err) { if (err.name !== 'AbortError') setError(err.message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, []);
  async function remove(id) {
    if (!window.confirm('Are you sure you want to delete this poem? This cannot be undone.')) return;
    setDeleting(id); setError('');
    try { await api(`/poems/${id}`, { method: 'DELETE' }); setPoems(current => current.filter(poem => poem.id !== id)); setNotice('Your poem has been deleted.'); }
    catch (err) { setError(err.message); }
    finally { setDeleting(null); }
  }
  return <div className={legacy ? 'page-poem' : 'page-poems'}>
    {!legacy && <SiteHeader />}
    <main className={legacy ? 'container' : 'poems-page'}>
      {legacy ? <><h1>My Poems</h1><p><Link to="/write">Write a New Poem</Link> | <Link to="/dashboard">Dashboard</Link></p></> : <div className="poems-heading"><div className="eyebrow">Your words, your world</div><h1>My Poems</h1><p>Your little collection of thoughts, feelings, and stories, {user.name}.</p><Link className="button" to="/write">＋ Write a new poem</Link></div>}
      <Message>{notice}</Message><Message error>{error}</Message>
      {error && <button type="button" className="button" onClick={() => load()}>Try again</button>}
      {loading ? <p role="status">Gathering your words…</p> : !error && poems.length === 0 ? <section className="empty-poems"><h2>Your poetry journey starts here.</h2><p>You haven't saved any poems yet. Write your first one and it will appear here.</p><Link className="button" to="/write">Write my first poem</Link></section> : <section className="poem-list">{poems.map(poem => <article className={legacy ? 'poem-card' : 'saved-poem'} key={poem.id}>
        <h2>{poem.title}</h2><p className="poem-date">Saved {new Date(poem.createdAt).toLocaleString()}</p>
        <div className="poem-content">{poem.content}</div>
        <p className="poem-date">Written by {poem.author || user.name} · {poem.mood}</p>
        <div className="poem-actions"><button className="delete-button" type="button" onClick={() => remove(poem.id)} disabled={deleting !== null}>{deleting === poem.id ? 'Deleting…' : '🗑 Delete Poem'}</button></div>
      </article>)}</section>}
    </main>{!legacy && <Footer>Every poem holds a piece of its poet. ♡</Footer>}
  </div>;
}
