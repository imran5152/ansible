import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { SimpleNav, Footer, Message } from '../components';

const empty = { title: '', author: '', mood: 'Love', content: '' };
const moods = ['Love', 'Heartbreak', 'Healing', 'Nature', 'Hope', 'Life', 'Friendship'];
const draftKey = id => `poetryVerseDraft:${id}`;
function readDraft(id) {
  try {
    const data = JSON.parse(localStorage.getItem(draftKey(id)) || 'null');
    if (data && ['title', 'author', 'mood', 'content'].every(key => typeof data[key] === 'string')) {
      return { title: data.title.slice(0, 200), author: data.author.slice(0, 100), content: data.content.slice(0, 50000), mood: moods.includes(data.mood) ? data.mood : 'Love' };
    }
  } catch { /* A blocked or corrupt storage entry should not prevent writing. */ }
  return { ...empty };
}
export default function Write() {
  const { user } = useAuth();
  const [draft, setDraft] = useState(() => readDraft(user.id));
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const words = draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0;
  const update = event => setDraft(current => ({ ...current, [event.target.name]: event.target.value }));
  function showPreview() {
    setError('');
    if (!draft.content.trim()) { setMessage('Write a few lines first, then preview your poem.'); return; }
    setPreview({ ...draft }); setMessage('Your poem preview is ready. ♡');
  }
  function saveDraft() {
    setError('');
    if (!draft.content.trim()) { setMessage('Write something before saving your draft.'); return; }
    try { localStorage.setItem(draftKey(user.id), JSON.stringify(draft)); setMessage('Draft saved on this browser! ♡'); }
    catch { setError('Could not save the draft in this browser.'); }
  }
  function clear() {
    if (!window.confirm('Would you like to clear your poem?')) return;
    setDraft({ ...empty }); setPreview(null); setError(''); setMessage('A fresh page awaits you.');
    try { localStorage.removeItem(draftKey(user.id)); } catch { /* The editor still clears if storage is blocked. */ }
  }
  async function save(event) {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true);
    try {
      await api('/poems', { method: 'POST', body: draft });
      try { localStorage.removeItem(draftKey(user.id)); } catch { /* The server save has succeeded. */ }
      navigate('/my-poems?saved=1');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="page-write">
    <SimpleNav />
    <main><p className="eyebrow">Your words, your world</p><h1>Let your heart speak.</h1><p className="subtitle">Every feeling deserves a place on paper.</p>
      <section className="editor"><form onSubmit={save}>
        <label htmlFor="title">Poem title</label><input id="title" name="title" value={draft.title} onChange={update} maxLength={200} placeholder="Give your poem a beautiful name" required />
        <label htmlFor="author">Your pen name</label><input id="author" name="author" value={draft.author} onChange={update} maxLength={100} placeholder="What shall we call you?" />
        <label htmlFor="mood">Choose your mood</label><select id="mood" name="mood" value={draft.mood} onChange={update}>{moods.map(mood => <option key={mood}>{mood}</option>)}</select>
        <label htmlFor="poem">Your poem</label><textarea id="poem" name="content" value={draft.content} onChange={update} maxLength={50000} placeholder="Write what your heart cannot say aloud..." required />
        <p className="hint" aria-live="polite">{words} {words === 1 ? 'word' : 'words'} · Take your time.</p>
        <div className="actions">
          <button className="primary" type="button" onClick={showPreview} disabled={busy}>Preview poem ↗️</button>
          <button className="secondary" type="button" onClick={saveDraft} disabled={busy}>Save draft on this device</button>
          <button className="secondary" type="button" onClick={clear} disabled={busy}>Start again</button>
          <button className="primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save Poem ♡'}</button>
        </div>
      </form></section>
      {preview && <section className="preview is-visible" aria-label="Poem preview"><h2>{preview.title.trim() || 'Untitled Poem'}</h2><p>{preview.content}</p><small>Written by {preview.author.trim() || 'Anonymous'}</small><p className="hint">Mood: {preview.mood}</p></section>}
      <p className="hint" role="status">{message}</p><Message error>{error}</Message>
    </main><Footer />
  </div>;
}
