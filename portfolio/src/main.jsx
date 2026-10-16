import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, ArrowRight, ArrowDown, Check, ChevronDown, Code2, Copy, Download, ExternalLink, Github, Globe2, Layers3, Mail, MapPin, Menu, MoveUpRight, Server, Terminal, X, Braces, Box, Cloud, LayoutTemplate, Send, Sparkles, Heart, Phone, GraduationCap, ShoppingBag, Play, FileText } from 'lucide-react';
import { profile, projects, moreProjects, skills, services, contactLink } from './data';
import './styles.css';

const assetUrl = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const icons = { layout: LayoutTemplate, code: Code2, cloud: Cloud };
function Arrow({ className = '' }) { return <ArrowUpRight size={18} className={className} aria-hidden="true" />; }
function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65, delay, ease: [.22, 1, .36, 1] }} {...props}>{children}</motion.div>;
}
function SectionLabel({ children, number }) { return <div className="section-label"><span className="label-dot" />{children}<span className="section-number">/{number}</span></div>; }
function Tags({ items }) { return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>; }

function Header({ openContact }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const toggleRef = useRef(null);
  useEffect(() => {
    function escape(event) { if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); } }
    if (menuOpen) window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-20% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const links = [['work', 'Work'], ['about', 'About'], ['services', 'Services']];
  return <header className="site-header"><div className="header-inner wrap">
    <a className="wordmark" href="#home" aria-label="Imran Pathan — home">imran<span>.</span><span className="wordmark-small">PATHAN</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><span className="header-note"><span className="status-dot" />Open to opportunities</span><button className="button button-dark nav-contact" onClick={() => openContact('project')}>Let’s talk <Arrow /></button><button ref={toggleRef} className="icon-button mobile-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}<button onClick={() => { setMenuOpen(false); openContact('project'); }}>Let’s talk <Arrow /></button></motion.nav>}</AnimatePresence>
  </div></header>;
}

function HeroVisual() {
  return <div className="hero-visual" aria-hidden="true">
    <div className="visual-grid" /><div className="visual-ring ring-one" /><div className="visual-ring ring-two" />
    <div className="visual-coordinate top-coordinate">A LITTLE CREATIVITY. A LOT OF CURIOSITY.</div>
    <svg className="connection-lines" viewBox="0 0 580 570" fill="none"><path d="M135 335V230Q135 210 155 210H390Q410 210 410 190V120" /><path d="M290 270V400Q290 420 310 420H440" /><path d="M420 220V330Q420 350 400 350H210" /><circle className="travel-dot" r="4"><animateMotion dur="7s" repeatCount="indefinite" path="M135 335V230Q135 210 155 210H390Q410 210 410 190V120" /></circle></svg>
    <div className="floating-label label-react"><span className="react-symbol">⚛</span><div>Built to feel right<small>REACT · FRONTEND</small></div></div>
    <div className="floating-label label-cloud"><Cloud size={22} /><div>Ready for what’s next<small>CONTAINERS · CLOUD</small></div></div>
    <div className="code-window"><div className="window-bar"><span /><span /><span /><small>an idea worth building</small><Code2 size={13} /></div><div className="code-content"><div className="line-numbers">1<br />2<br />3<br />4<br />5<br />6</div><div><span className="syntax-purple">const</span> <span className="syntax-yellow">imran</span> = {'{'}<br /><span className="code-indent">craft: <span className="syntax-green">'web experiences'</span>,</span><br /><span className="code-indent">mindset: <span className="syntax-green">'keep learning'</span>,</span><br /><span className="code-indent">from: <span className="syntax-green">'code to cloud'</span></span><br />{'}'};<br /><span className="syntax-yellow">build</span>(imran.<span className="syntax-green">nextIdea</span>);<span className="code-cursor" /></div></div></div>
    <div className="browser-tile"><div className="mini-browser-bar"><i /><i /><i /><span>something good is taking shape</span></div><div className="browser-tile-content"><span className="tiny-star">✳</span><div>Good ideas.<br /><em>Well built.</em></div><span className="mini-tag">DESIGN → DEVELOP → DEPLOY</span></div><div className="tile-bottom"><span>Made with intention</span><ArrowUpRight size={17} /></div></div>
    <div className="orbital-badge"><svg viewBox="0 0 100 100"><defs><path id="circle-path" d="M50 50m-35 0a35 35 0 1 1 70 0a35 35 0 1 1-70 0" /></defs><text><textPath href="#circle-path" textLength="218">ALWAYS BUILDING · ALWAYS LEARNING · </textPath></text></svg><span>✳</span></div>
    <div className="visual-signature"><span className="signature-line" />A DEVELOPER’S WORK IN PROGRESS<span>↗</span></div>
  </div>;
}

function Hero({ openContact }) {
  return <section id="home" className="hero wrap"><div className="hero-copy">
    <Reveal><div className="hero-eyebrow"><span className="small-cross">✳</span>HELLO, I’M IMRAN PATHAN</div></Reveal>
    <Reveal delay={.08}><h1>From <em>code</em><br />to <span className="cloud-word">cloud<span className="heading-dot">.</span></span></h1></Reveal>
    <Reveal delay={.16}><p className="hero-description">I turn ideas into thoughtful web experiences.<br className="desktop-break" /> Full-stack developer. DevOps enthusiast.<br className="desktop-break" /> A curious mind, ready to build what’s next.</p></Reveal>
    <Reveal delay={.24}><div className="hero-actions"><a href="#work" className="button button-dark">Explore my work <ArrowDown size={17} /></a><button className="button button-outline" onClick={() => openContact('hire')}>Hire me <Arrow /></button></div><div className="hero-footnote"><MapPin size={13} />Maharashtra, India<span className="tiny-separator" />Open to roles & freelance</div></Reveal>
  </div><Reveal className="hero-art-wrap" delay={.15}><HeroVisual /></Reveal><div className="hero-bottom"><span>THOUGHTFUL INTERFACES. PRACTICAL ENGINEERING.</span><a href="#work">A little scroll, a lot to discover <ArrowDown size={14} /></a></div></section>;
}
function StackStrip() {
  return <div className="stack-strip"><div className="wrap stack-strip-inner"><span className="strip-intro">MY EVERYDAY TOOLKIT</span><div><Braces size={24} /><span>React</span></div><div><Server size={21} /><span>Node.js</span></div><div><Layers3 size={22} /><span>MongoDB</span></div><div><Box size={22} /><span>Docker</span></div><div><Cloud size={24} /><span>Kubernetes</span></div><div><Github size={22} /><span>GitHub</span></div></div></div>;
}

function ProjectCover({ project }) {
  if (project.cover === 'shopwave') return <div className="project-cover cover-shop"><span className="cover-kicker">SHOPWAVE / E-COMMERCE</span><div className="shop-screen"><div className="screen-top"><span /><span /><span /><small>shopwave.store</small></div><img src={assetUrl(project.image)} alt="ShopWave e-commerce application screenshot" loading="lazy" width="1280" height="720" /></div><span className="cover-caption">A store that feels like an experience.</span><div className="project-cover-corner"><ShoppingBag size={17} /></div></div>;
  if (project.cover === 'cloud') return <div className="project-cover cover-cloud"><span className="cover-kicker">JAVA–REACT–K8S / DEPLOYMENT</span><div className="cloud-architecture"><div className="architecture-top"><span className="cloud-box"><Cloud size={29} /></span><span>Kubernetes</span></div><div className="architecture-connectors"><span /><span /><span /></div><div className="architecture-nodes"><div><Braces /><strong>React</strong><small>FRONTEND</small></div><div><Server /><strong>Java</strong><small>BACKEND</small></div><div><Layers3 /><strong>Database</strong><small>DATA LAYER</small></div></div></div><div className="cloud-terminal"><span>❯</span> kubectl apply -f k8s/<span className="terminal-caret">▍</span></div><div className="project-cover-corner"><Terminal size={17} /></div></div>;
  if (project.cover === 'streaming') return <div className="project-cover cover-streaming"><span className="cover-kicker">STREAMING / INTERFACE STUDY</span><div className="streaming-screen"><div className="stream-nav"><strong>N</strong><span>Home&nbsp;&nbsp; Movies&nbsp;&nbsp; My list</span><span className="stream-avatar" /></div><div className="stream-main"><span>AN INTERFACE FOR</span><strong>ONE MORE<br />EPISODE.</strong><div><span className="stream-play"><Play size={9} fill="currentColor" /> Play</span><small>Discover something new</small></div></div><div className="stream-thumbnails"><span /><span /><span /><span /><span /></div></div><div className="project-cover-corner"><Play size={17} /></div></div>;
  return <div className="project-cover cover-resume"><span className="cover-kicker">RESUME BUILDER / FULL STACK</span><div className="resume-art"><div className="resume-sheet sheet-back" /><div className="resume-sheet"><div className="resume-sheet-head"><span className="resume-avatar">IP</span><div><b>YOUR NEXT CHAPTER.</b><small>A resume that feels like you.</small></div></div><div className="resume-art-rule" /><span className="resume-section-title">THE STORY SO FAR</span><div className="fake-lines"><i /><i /><i /></div><span className="resume-section-title">BUILT WITH PURPOSE</span><div className="fake-lines short"><i /><i /></div><div className="resume-mini-tags"><span>React</span><span>Node.js</span><span>MongoDB</span></div></div><span className="resume-art-badge"><Check size={15} />Make your first impression count</span></div><div className="project-cover-corner"><FileText size={17} /></div></div>;
}

function ProjectDialog({ project, close, openContact }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <button className="icon-button dialog-close" aria-label="Close project details" onClick={close}><X /></button>
    <div className="dialog-cover"><ProjectCover project={project} /></div><div className="dialog-body"><span className="eyebrow">{project.role}</span><h2 id="project-dialog-title">{project.name}</h2><p>{project.description}</p><h3>What went into it</h3><ul>{project.highlights.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul><Tags items={project.tags} /><div className="dialog-actions">{project.source && <a className="button button-dark" href={project.source} target="_blank" rel="noreferrer">View source <Github size={17} /></a>}{project.demo && <a className="button button-outline" href={project.demo} target="_blank" rel="noreferrer">Visit live site <Arrow /></a>}{!project.source && <button className="button button-dark" onClick={() => { close(); openContact('project'); }}>Ask me about this project <Arrow /></button>}</div>{project.demo && <small className="dialog-note">The live demo is hosted on Render and may take a moment to wake up.</small>}</div>
  </dialog>;
}

function Work({ openContact }) {
  const [filter, setFilter] = useState('All work');
  const [selected, setSelected] = useState(null);
  const opener = useRef(null);
  const visible = filter === 'All work' ? projects : projects.filter(p => p.category === filter);
  function close() { setSelected(null); requestAnimationFrame(() => opener.current?.focus()); }
  return <section id="work" className="section work-section wrap"><Reveal><SectionLabel number="01">SELECTED WORK</SectionLabel><div className="section-heading-row"><h2>Less talk.<br /><em>More building.</em></h2><div className="section-heading-aside"><p>A few things I’ve brought to life.<br />Each one, a new problem to figure out.</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer">More on GitHub <Arrow /></a></div></div></Reveal>
    <Reveal><div className="work-toolbar"><div className="filter-group" role="group" aria-label="Filter projects">{['All work', 'Web development', 'DevOps'].map(item => <button key={item} aria-pressed={filter === item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}{filter === item && <span className="filter-count">{visible.length.toString().padStart(2, '0')}</span>}</button>)}</div><span className="work-hint" aria-live="polite">{visible.length} projects · Built to learn. Made to work.</span></div></Reveal>
    <motion.div layout className="projects-grid"><AnimatePresence mode="popLayout">{visible.map(project => <motion.article layout key={project.id} className="project-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .35 }}><button className="project-open" aria-label={`View ${project.name} project details`} onClick={event => { opener.current = event.currentTarget; setSelected(project); }}><ProjectCover project={project} /><div className="project-title-row"><div><span className="project-type">{project.type}</span><h3>{project.name}</h3></div><span className="project-arrow"><Arrow /></span></div></button><p className="project-summary">{project.summary}</p><Tags items={project.tags} /></motion.article>)}</AnimatePresence></motion.div>
    <Reveal className="more-work"><span className="more-work-label">ALSO IN THE REPOSITORY</span><div>{moreProjects.map(project => project.url ? <a key={project.name} href={project.url} target="_blank" rel="noreferrer"><span>{project.name}<small>{project.detail}</small></span><Arrow /></a> : <div className="more-work-item" key={project.name}><span>{project.name}<small>{project.detail}</small></span><span className="group-project-tag">Group project</span></div>)}</div></Reveal>
    {selected && <ProjectDialog project={selected} close={close} openContact={openContact} />}
  </section>;
}

function About({ openContact }) {
  return <section id="about" className="about-section"><div className="wrap"><Reveal><SectionLabel number="02">THE PERSON BEHIND THE CODE</SectionLabel></Reveal><div className="about-grid"><Reveal className="about-portrait"><div className="portrait-frame"><div className="portrait-grid" /><span className="portrait-overline">ENGINEERING × A LITTLE CREATIVITY</span><span className="portrait-monogram">ip<span>✳</span></span><div className="portrait-caption"><span>Imran Pathan<small>DEVELOPER & A WORK IN PROGRESS</small></span><ArrowUpRight size={25} /></div><span className="portrait-orbit" /></div><div className="portrait-note"><span className="handwriting">Always a student.</span><span>↗</span></div></Reveal>
    <Reveal className="about-copy" delay={.1}><h2>A builder by choice.<br /><em>Curious by default.</em></h2><p>I’m Imran, a BCA student from Vaijapur, Maharashtra. I enjoy the whole journey of making things for the web—from a thoughtful interface to the backend that makes it work.</p><p>That curiosity has taken me beyond React and Node.js into Docker, Kubernetes and deployment workflows. I’m still early in my journey, and I like getting my hands into the details.</p><p>Outside the terminal, you’ll find me drawing, singing, riding or gaming. I once spoke about education equality in front of 300+ students. Turns out, I enjoy sharing ideas as much as building them.</p><div className="education-card"><GraduationCap size={22} /><div><strong>Bachelor of Computer Applications <span>Pursuing</span></strong><p>{profile.college}</p><small>{profile.university}<br />Expected graduation: 2026</small></div></div><div className="about-links"><button className="text-link" onClick={() => openContact('hire')}>A little more about me? Let’s talk <Arrow /></button><a href={profile.github} aria-label="Imran on GitHub" target="_blank" rel="noreferrer"><Github size={20} /></a></div></Reveal></div></div></section>;
}
function Toolkit() {
  return <section id="toolkit" className="section toolkit-section wrap"><Reveal><SectionLabel number="03">WHAT I WORK WITH</SectionLabel><div className="section-heading-row"><h2>One idea.<br /><em>The right tools.</em></h2><p className="section-description">Comfortable across the stack.<br />Always adding something new to the toolkit.</p></div></Reveal><div className="skills-grid">{skills.map((skill, index) => { const Icon = icons[skill.icon]; return <Reveal key={skill.title} className="skill-card" delay={index * .08}><div className="skill-card-top"><span className="skill-icon"><Icon size={23} /></span><span>0{index+1}</span></div><h3>{skill.title}</h3><p>{skill.subtitle}</p><Tags items={skill.items} /></Reveal>; })}</div><Reveal className="learning-strip"><span className="learning-title"><span className="status-dot" />CURRENTLY EXPLORING</span><p>AWS foundations <span>↗</span> EC2, S3 & IAM <span>↗</span> EKS & Helm <span>↗</span> AWS CI/CD</p><span className="learning-note">Learning in public, one step at a time.</span></Reveal></section>;
}

function Services({ openContact }) {
  return <section id="services" className="services-section"><div className="wrap"><Reveal><SectionLabel number="04">LET’S MAKE SOMETHING USEFUL</SectionLabel><div className="section-heading-row"><h2>You have the idea.<br /><em>I’ll bring the build.</em></h2><p className="section-description">A new website, a better interface, or help<br />with your next project. Let’s figure it out.</p></div></Reveal><div className="services-list">{services.map((service, index) => { const Icon = icons[service.icon]; return <Reveal key={service.number} delay={index * .05}><button className="service-row" onClick={() => openContact('project')}><span className="service-number">{service.number}</span><div className="service-title"><Icon size={26} /><h3>{service.title}</h3></div><div className="service-description"><p>{service.description}</p><div>{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="service-arrow"><Arrow size={22} /></span></button></Reveal>; })}</div><Reveal className="process-line"><span>HOW WE GET THERE</span>{['A conversation', 'A clear plan', 'Build & refine', 'A thoughtful handover'].map((step,index) => <React.Fragment key={step}>{index > 0 && <ArrowRight size={14} />}<span><small>0{index+1}</small>{step}</span></React.Fragment>)}</Reveal></div></section>;
}

function Opportunities({ openContact }) {
  return <section className="opportunity-section wrap"><Reveal className="opportunity-card"><div className="opportunity-top"><span className="status-dot" />OPEN TO THE RIGHT OPPORTUNITY</div><div className="opportunity-grid"><div><h2>Your next teammate?<br /><em>Could be me.</em></h2><p>I’m looking for an internship or an early-career role in web development or DevOps. If your team values curiosity, ownership and a willingness to learn, let’s talk.</p><button className="button button-cream" onClick={() => openContact('hire')}>Talk about a role <Arrow /></button></div><div className="resume-downloads"><span>TAKE A CLOSER LOOK</span><a href={assetUrl("/resumes/Imran-Full-Stack-Resume.pdf")} download><span className="resume-file-icon"><Code2 /></span><div>Full-stack resume<small>REACT · NODE.JS · MONGODB</small></div><Download size={18} /></a><a href={assetUrl("/resumes/Imran-DevOps-Resume.pdf")} download><span className="resume-file-icon"><Cloud /></span><div>DevOps resume<small>DOCKER · KUBERNETES · CI/CD</small></div><Download size={18} /></a><p>Two sides of the same curious developer.</p></div></div><span className="opportunity-decoration" aria-hidden="true">✳</span></Reveal></section>;
}

function Contact({ intent, setIntent }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [message, setMessage] = useState('');
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyError(''); }
    catch { setCopyError(`Copy this address: ${profile.email}`); }
  }
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2500); return () => clearTimeout(timer); }, [copied]);
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    window.location.href = contactLink(intent, values);
    setMessage('Your email app should open with your message. You can also email me directly using the address on the left.');
  }
  return <section id="contact" className="contact-section wrap"><Reveal><SectionLabel number="05">THE NEXT GOOD THING STARTS WITH HELLO</SectionLabel></Reveal><div className="contact-grid"><Reveal className="contact-copy"><h2>Let’s make<br /><em>good things.</em><span className="contact-asterisk" aria-hidden="true">✳</span></h2><p>A role, a project, or just a good conversation.<br />My inbox is open.</p><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a><button className="copy-email" onClick={copyEmail}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Email copied!' : 'Copy email address'}</button><span className="copy-status" role="status">{copyError || (copied ? 'Email address copied to clipboard.' : '')}</span><div className="contact-socials"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} />GitHub <Arrow size={13} /></a><a href={`tel:${profile.phoneLink}`}><Phone size={16} />{profile.phone}</a></div><div className="contact-location"><span className="india-flag" aria-hidden="true"><i /><i /><i /></span>{profile.location}</div></Reveal>
    <Reveal className="contact-form-wrap" delay={.08}><div className="intent-switch" role="group" aria-label="What would you like to discuss?"><button className={intent === 'project' ? 'selected' : ''} aria-pressed={intent === 'project'} onClick={() => { setIntent('project'); setMessage(''); }}>I have a project <Arrow size={14} /></button><button className={intent === 'hire' ? 'selected' : ''} aria-pressed={intent === 'hire'} onClick={() => { setIntent('hire'); setMessage(''); }}>I’m hiring <Arrow size={14} /></button></div><form onSubmit={submit}><div className="form-heading"><h3>{intent === 'project' ? 'What are you thinking of building?' : 'Let’s talk about your team.'}</h3><p>{intent === 'project' ? 'A little context is a great place to start.' : 'I’d love to hear about the opportunity.'}</p></div><div className="form-row"><div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="What should I call you?" required maxLength={100} /></div><div><label htmlFor="contact-email">Your email</label><input type="email" id="contact-email" name="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /></div></div><label htmlFor="contact-message">{intent === 'project' ? 'A little about the project' : 'A little about the role'}</label><textarea id="contact-message" name="message" placeholder={intent === 'project' ? 'The idea, the timeline, the things that matter…' : 'The role, your team, and what you’re looking for…'} required minLength={10} maxLength={5000} rows={4} /><div className="form-bottom"><small>This opens your email app.<br />No forms disappearing into the void.</small><button className="button button-dark" type="submit">Let’s start a conversation <Arrow /></button></div><p className="form-status" role="status">{message}</p></form></Reveal></div></section>;
}

function Footer() {
  return <footer className="footer wrap"><a className="wordmark" href="#home">imran<span>.</span><span className="wordmark-small">PATHAN</span></a><p>Built with React, a little motion, and a lot of curiosity.</p><div><span>© {new Date().getFullYear()} Imran Pathan</span><a href="#home" aria-label="Back to top"><ArrowUpRight size={20} /></a></div></footer>;
}
function App() {
  const [intent, setIntent] = useState('project');
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: .001 });
  function openContact(value) { setIntent(value); document.getElementById('contact')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main-content">Skip to content</a><motion.div className="scroll-progress" style={{ scaleX }} /><Header openContact={openContact} /><main id="main-content"><Hero openContact={openContact} /><StackStrip /><Work openContact={openContact} /><About openContact={openContact} /><Toolkit /><Services openContact={openContact} /><Opportunities openContact={openContact} /><Contact intent={intent} setIntent={setIntent} /></main><Footer /></MotionConfig>;
}
createRoot(document.getElementById('root')).render(<App />);
