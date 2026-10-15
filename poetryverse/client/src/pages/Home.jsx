import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [liked, setLiked] = useState([false, false, false]);
  const toggleLike = index => setLiked(current => current.map((value, i) => i === index ? !value : value));
  return <div className="page-home">
<header className="site-header">
    <Link to="/" className="brand">
        <span className="brand-icon">✿</span>
        <span>PoetryVerse</span>
    </Link>

    <nav className="main-menu">
        <Link to="/">Home</Link>
        <a href="#discover">Discover</a>
        <Link to="/signup" className="signup-link">Sign Up</Link>
        <Link to="/login" className="login-link">Log In</Link>
    </nav>
</header>


<div className="container">

<nav>
    <a href="#home" className="logo">Poetry<span>Verse.</span></a>

    <div className="links">
        <a href="#home">Home</a>
        <a href="#discover">Discover</a>
        <a href="#poems">Poetry</a>
        <a href="#about">Our little world</a>
    </div>

    <a href="#write" className="nav-btn">Write with us ↗</a>
</nav>

<section className="hero" id="home">
    <div className="hero-copy-wrap">
        <span className="eyebrow">✳ &nbsp; A little corner of poetry</span>

        <h1>For hearts that<br />feel <em>everything.</em></h1>

        <p className="hero-desc">
            A home for the unsent letters, the midnight thoughts,
            the beautiful mess of being human, and every feeling
            that deserves to become a poem.
        </p>

        <div className="actions">
            <a href="#poems" className="primary">Wander through words ↗</a>
            <a href="#discover" className="secondary">Find your feeling</a>
        </div>

        <p className="note">♡ &nbsp; Read slowly. Feel deeply. Stay awhile.</p>
    </div>

    <div className="hero-art">
        <div className="sun"></div>
        <span className="art-spark spark-a">✳</span>
        <span className="art-spark spark-b">✧</span>
        <span className="art-spark spark-c">✳</span>
        <span className="plant">❧</span>

        <div className="paper">
            <small>A page from the heart</small>
            <h2>Somewhere<br />between the<br />sun & the soul</h2>
            <p>for all the things words can hold</p>
            <div className="ornament">❦</div>
        </div>
    </div>
</section>

</div>

<div className="intro-strip">
    <span>Words that heal</span>
    <span>Feelings that bloom</span>
    <span>Stories that stay</span>
</div>

<div className="container">

<section className="section" id="discover">
    <div className="section-top">
        <div>
            <span className="label">A feeling for every season</span>
            <h2>What is your heart saying?</h2>
            <p className="subtext">Whatever you're feeling, there's a little poetry for it.</p>
        </div>
    </div>

    <div className="categories">
        <a className="category" href="#poems">
            <span className="symbol">♡</span>
            <strong>Love</strong>
            <small>Soft & timeless</small>
        </a>

        <a className="category" href="#poems">
            <span className="symbol">❀</span>
            <strong>Healing</strong>
            <small>Slowly blooming</small>
        </a>

        <a className="category" href="#poems">
            <span className="symbol">☼</span>
            <strong>Hope</strong>
            <small>Light ahead</small>
        </a>

        <a className="category" href="#poems">
            <span className="symbol">☾</span>
            <strong>Heartbreak</strong>
            <small>Things left unsaid</small>
        </a>

        <a className="category" href="#poems">
            <span className="symbol">❧</span>
            <strong>Nature</strong>
            <small>Earth & wonder</small>
        </a>
    </div>
</section>

<section className="section" id="poems">
    <div className="section-top">
        <div>
            <span className="label">Collected with love</span>
            <h2>Little poems, big feelings.</h2>
            <p className="subtext">Stay for a line. Leave with a feeling.</p>
        </div>
        <a href="#write" className="text-link">Share your poetry ↗</a>
    </div>

    <div className="poem-grid">

        <article className="poem-card">
            <div className="card-art art-rose"><span>🌷</span></div>
            <div className="card-body">
                <span className="tag">On healing</span>
                <h3>The art of beginning again</h3>
                <p className="verse">
                    Even the flowers lose their petals,<br />
                    even the trees let go;<br />
                    yet every spring, the world remembers<br />
                    the beautiful things that grow.
                </p>
                <div className="card-foot">
                    <span>A note to the soul</span>
                    <button className={`heart ${liked[0] ? 'liked' : ''}`} aria-label="Like poem" aria-pressed={liked[0]} onClick={() => toggleLike(0)}>{liked[0] ? '♥' : '♡'}</button>
                </div>
            </div>
        </article>

        <article className="poem-card">
            <div className="card-art art-sunset"><span>☼</span></div>
            <div className="card-body">
                <span className="tag">On love</span>
                <h3>In another lifetime</h3>
                <p className="verse">
                    If time could fold its golden wings,<br />
                    I'd find you where the wild bird sings;<br />
                    and in a world untouched by goodbye,<br />
                    we'd watch forever fill the sky.
                </p>
                <div className="card-foot">
                    <span>Letters never sent</span>
                    <button className={`heart ${liked[1] ? 'liked' : ''}`} aria-label="Like poem" aria-pressed={liked[1]} onClick={() => toggleLike(1)}>{liked[1] ? '♥' : '♡'}</button>
                </div>
            </div>
        </article>

        <article className="poem-card">
            <div className="card-art art-sage"><span>🍃</span></div>
            <div className="card-body">
                <span className="tag">On hope</span>
                <h3>For the days ahead</h3>
                <p className="verse">
                    You do not have to bloom today,<br />
                    or have the perfect words to say;<br />
                    just breathe, dear heart, and take your time,<br />
                    even the stars must wait to shine.
                </p>
                <div className="card-foot">
                    <span>For softer days</span>
                    <button className={`heart ${liked[2] ? 'liked' : ''}`} aria-label="Like poem" aria-pressed={liked[2]} onClick={() => toggleLike(2)}>{liked[2] ? '♥' : '♡'}</button>
                </div>
            </div>
        </article>

    </div>
</section>

<section className="quote" id="about">
    <div className="quote-mark">“</div>
    <h2>Some feelings are too beautiful to keep inside, and too complicated to say out loud.</h2>
    <p>That is where poetry begins.</p>
</section>

<section className="write-section" id="write">
    <div className="write-box">
        <span className="label">Your words belong here</span>
        <h2>Have a little poetry in you?</h2>
        <p>
            A thought scribbled at midnight. A love you can't explain.
            A story only you can tell. Give your words a place to live.
        </p>
        <Link to="/write" className="primary">Let your words bloom ↗</Link>
    </div>
</section>

<footer>
    <div className="footer-inner">
        <a href="#home" className="logo">Poetry<span>Verse.</span></a>
        <p>Made with warmth, words & a little wonder. © 2026</p>
        <div className="footer-links">
            <a href="#discover">Discover</a>
            <a href="#poems">Poems</a>
            <a href="#write">Write</a>
        </div>
    </div>
</footer>

</div>
</div>;
}
