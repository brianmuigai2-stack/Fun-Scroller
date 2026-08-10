import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ChevronUp, MousePointer2, RotateCw, Sparkles, Ticket, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [tickets, setTickets] = useState(3);
  const [spinning, setSpinning] = useState(false);
  const [meter, setMeter] = useState(71);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.14 },
    );
    revealRefs.current.forEach(element => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const reveal = (index: number, delay = '') => (element: HTMLElement | null) => {
    if (element) {
      element.classList.add('reveal');
      if (delay) element.classList.add(delay);
      revealRefs.current[index] = element;
    }
  };
  const addTicket = () => {
    setTickets(current => current + 1);
    setMeter(current => Math.min(100, current + 4));
  };
  const spinWheel = () => {
    setSpinning(false);
    requestAnimationFrame(() => setSpinning(true));
    setTickets(current => current + 1);
  };
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="playground">
      <div className="progress-track" aria-hidden="true"><div className="progress-fill" style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <header className="topbar">
        <a className="brand" href="#top" data-testid="link-brand"><span className="brand-mark" />wonderloop</a>
        <nav className="topnav" aria-label="Page sections">
          <a href="#ride" data-testid="link-ride">the ride</a>
          <a href="#oddities" data-testid="link-oddities">oddities</a>
          <button className="sound-btn" onClick={() => setSoundOn(value => !value)} data-testid="button-sound" aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />} {soundOn ? 'sound on' : 'quiet mode'}
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">tiny digital amusement park / open all hours</div>
            <h1>Take the scenic <em>route.</em></h1>
            <p className="hero-lede">A small place on the internet for wandering without a destination. Scroll slowly. The park is more fun when you miss a turn.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => jump('ride')} data-testid="button-start-ride"><Ticket size={17} /> spend a ticket</button>
              <button className="ghost-btn" onClick={addTicket} data-testid="button-find-ticket"><Sparkles size={16} /> find a ticket</button>
            </div>
            <div className="ticket-count" data-testid="status-tickets"><Ticket size={14} /> pocket inventory: <strong>{tickets} tickets</strong></div>
          </div>
          <div className="hero-orbit" aria-label="A floating illustrated sun in orbit">
            <div className="orbit-ring" /><div className="orbit-ring ring-two" /><div className="sky-ball" />
            <div className="orbit-card one">NO MAPS NEEDED</div><div className="orbit-card two">LOOK, A SIDE QUEST</div><div className="orbit-card three">HELLO, YOU</div>
            <span className="star a">✦</span><span className="star b">✦</span><span className="star c">✦</span>
          </div>
        </div>
        <div className="scroll-note"><MousePointer2 size={15} /> scroll to wander <ArrowDown size={16} /></div>
      </section>

      <div className="marquee" aria-label="Park notices">
        <div className="marquee-inner">
          {Array.from({ length: 2 }).map((_, index) => <span key={index}><span>THE LONG WAY IS THE GOOD WAY</span><i className="dot" /><span>PLEASE KEEP ARMS INSIDE THE BROWSER</span><i className="dot" /><span>NO DESTINATION, JUST MOMENTUM</span><i className="dot" /></span>)}
        </div>
      </div>

      <section className="section" id="ride">
        <div className="section-heading">
          <div ref={reveal(0)}><div className="eyebrow">01 / the main attraction</div><h2>One little ride.<br />Infinite exits.</h2></div>
          <p ref={reveal(1, 'reveal-delay-1')}>This carousel does not go anywhere. That is the point. Hover the cabins. Let the scene do its tiny loop.</p>
        </div>
        <div className="scene-wrap reveal" ref={reveal(2)}>
          <div className="scene-label">WONDERLOOP PARK / EST. JUST NOW</div><div className="scene-sun" />
          <div className="cloud one" /><div className="cloud two" /><div className="track" /><div className="boardwalk" />
          <div className="ride">
            <div className="ride-roof" /><div className="ride-post" /><div className="ride-base" /><div className="ride-arm" />
            <div className="cabin c1" /><div className="cabin c2" /><div className="cabin c3" />
          </div>
          <div className="scene-caption">The scenic route is scenic.</div><div className="ride-hint">hover a cabin to go nowhere faster →</div>
        </div>
      </section>

      <section className="section" id="oddities">
        <div className="section-heading">
          <div ref={reveal(3)}><div className="eyebrow">02 / pocket-sized oddities</div><h2>Things to do while the clouds move.</h2></div>
          <p ref={reveal(4, 'reveal-delay-1')}>Every button here is a trapdoor. Press one. We promise nothing important will happen.</p>
        </div>
        <div className="cards">
          <article className={`moment-card card-big reveal ${spinning ? 'spin' : ''}`} ref={reveal(5)}>
            <div className="eyebrow">the wheel of maybe</div><h3>Choose your next tiny feeling.</h3><p>It will land on something vaguely accurate. It has been calibrated by a committee of moths.</p>
            <button className="ghost-btn" onClick={spinWheel} data-testid="button-spin-wheel"><RotateCw size={16} /> spin the wheel</button><div className="wheel" aria-hidden="true" />
          </article>
          <article className="moment-card card-small reveal reveal-delay-1" ref={reveal(6)}>
            <div className="eyebrow">planet no. 7</div><h3>It has one moon and a very good attitude.</h3><p>Click the planet. It likes that.</p>
            <button className="primary-btn" onClick={addTicket} data-testid="button-pat-planet"><Sparkles size={16} /> pat the planet</button><div className="tiny-planet" aria-hidden="true"><span className="planet-dot" /></div>
          </article>
        </div>
      </section>

      <section className="meter reveal" ref={reveal(7)}>
        <div><div className="eyebrow">03 / visitor energy</div><h2>You are doing great.</h2><p className="meter-copy">The park can tell you are still here. This little meter is powered by curiosity and very small clicks.</p></div>
        <div><div className="meter-rail"><div className="meter-fill" style={{ width: `${meter}%` }} /></div><div className="meter-labels"><span>arrived five seconds ago</span><strong data-testid="text-meter">{meter}% delight</strong><span>fully looped</span></div></div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div><div className="eyebrow">last stop / probably</div><h2>Stay<br />curious.</h2></div>
          <div><p className="footer-note">The exit is just below. Or is it? Scroll back up and take the weird shortcut.</p><button className="bounce-back" onClick={() => jump('top')} data-testid="button-back-top"><ChevronUp size={15} /> bounce back</button></div>
        </div>
        <div className="footer-bottom"><span>made for people with one more minute</span><span className="mono">wonderloop / 001</span></div>
      </footer>
    </main>
  );
}

export default App;