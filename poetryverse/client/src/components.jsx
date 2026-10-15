import { Link } from 'react-router-dom';

export function SimpleNav() {
  return <nav><Link className="logo" to="/">PoetryVerse.</Link><Link to="/">← Back to home</Link></nav>;
}
export function SiteHeader({ profile = false }) {
  return <header className="site-header">
    <Link className="brand" to="/"><span className="brand-icon">✿</span> PoetryVerse</Link>
    <nav className="main-menu">
      <Link to={profile ? '/dashboard' : '/'}>{profile ? 'Dashboard' : 'Home'}</Link>
      <Link to={profile ? '/my-poems' : '/profile'}>{profile ? 'My Poems' : 'My Profile'}</Link>
      <Link to="/write">Write</Link>
    </nav>
  </header>;
}
export function Footer({ children = 'Made with love, for every feeling. ♡' }) { return <footer>{children}</footer>; }
export function Message({ error, children }) {
  return children ? <div className={`message ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}>{children}</div> : null;
}
export function initials(name) {
  const parts = name.trim().split(/\s+/);
  return [parts[0], ...(parts.length > 1 ? [parts.at(-1)] : [])].map(part => Array.from(part)[0] || '').join('').toLocaleUpperCase() || 'P';
}
