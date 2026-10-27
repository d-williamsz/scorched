import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaGlobe,
  FaUser,
} from 'react-icons/fa';

import deEvolutionImg  from './assets/skyline_concept.jpeg';
import logoLeft        from './assets/ScorchedLogo_topleft.png';
import logoRight       from './assets/ScorchedLogo_topright.png';
import logoAnimation   from './assets/scorchedLogo_animation.png';
import logoIcon        from './assets/Scorched_LogoIcon_1000sq.png';
import Navbar          from './Navbar';
import { HeroBackground } from './HeroBackground';

// ── Hero ─────────────────────────────────────────────────────────────────────
const O_TRANSITIONS = [
  { id: 'flip',  label: 'Flip'  },
  { id: 'fade',  label: 'Fade'  },
  { id: 'cut',   label: 'Cut'   },
];

const O_SPEEDS = [
  { id: 'slow',   label: 'Slow',   ms: 4000 },
  { id: 'normal', label: 'Normal', ms: 2400 },
  { id: 'fast',   label: 'Fast',   ms: 800  },
];

function HeroTitle() {
  const [flipped,   setFlipped]   = useState(false);
  const [transMode, setTransMode] = useState('flip');
  const [speed,     setSpeed]     = useState('normal');
  const [opacity,   setOpacity]   = useState(1);

  const intervalMs = O_SPEEDS.find(s => s.id === speed)?.ms ?? 2400;

  useEffect(() => {
    const id = setInterval(() => {
      if (transMode === 'fade') {
        setOpacity(0);
        setTimeout(() => { setFlipped(f => !f); setOpacity(1); }, 260);
      } else {
        setFlipped(f => !f);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [transMode, intervalMs]);

  const oStyle = {
    transform:  flipped ? 'scaleX(-1)' : 'scaleX(1)',
    opacity,
    transition: transMode === 'flip' ? 'transform 0.45s ease-in-out'
              : transMode === 'fade' ? 'opacity 0.25s ease-in-out'
              : 'none',
  };

  return (
    <div className="hero-title-overlay hero-title-overlay--center">
      <div className="hero-logo-wrapper">
        <div className="hero-logo-assembly">
          <div className="hero-logo-top">
            <img src={logoLeft}  alt="" className="hero-logo-left" />
            <img src={logoIcon}  alt="" className="hero-logo-o" style={oStyle} />
            <img src={logoRight} alt="" className="hero-logo-right" />
          </div>
          <img src={logoAnimation} alt="Scorched Animation" className="hero-logo-anim" />
        </div>
        <div className="hero-o-controls">
          <div className="hero-o-toggle" role="group" aria-label="O transition style">
            {O_TRANSITIONS.map(t => (
              <button
                key={t.id}
                className={`hero-mode-btn${transMode === t.id ? ' active' : ''}`}
                onClick={() => setTransMode(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="hero-o-toggle" role="group" aria-label="O animation speed">
            {O_SPEEDS.map(s => (
              <button
                key={s.id}
                className={`hero-mode-btn${speed === s.id ? ' active' : ''}`}
                onClick={() => setSpeed(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon ───────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    slug: 'de-evolution',
    title: '(De)Evolution',
    tagline: 'What does it mean to move forward?',
    para1:
      'Set against a world teetering on the edge of collapse, (De)Evolution follows a community of survivors who discover that the line between progress and regression has always been thinner than they imagined.',
    para2:
      "Currently in development, (De)Evolution marks Scorched Animation's debut feature. Drawing on Indigenous storytelling traditions and contemporary animation techniques, the project is expected to premiere on the festival circuit in late 2026.",
    img: deEvolutionImg,
  },
  {
    slug: 'kindling',
    title: 'Kindling',
    tagline: 'The first spark changes everything.',
    para1:
      'A young pyrographer in a coastal town discovers her craft has consequences that ripple far beyond the wood she burns. Kindling is a short film about creativity, responsibility, and the things we leave behind.',
    para2:
      'Currently in pre-production. Kindling is expected to complete principal animation in mid-2026, with festival submissions planned to follow shortly after.',
    img: deEvolutionImg,
  },
  {
    slug: 'the-drift',
    title: 'The Drift',
    tagline: 'Some currents carry you whether you choose them or not.',
    para1:
      'Following three generations of a family separated by sea and circumstance, The Drift weaves together parallel journeys in a meditation on belonging, displacement, and the invisible threads that connect us across time.',
    para2:
      'In early development. The Drift is a co-production drawing on oral histories and traditional Pacific navigational knowledge to inform its visual language and structure.',
    img: deEvolutionImg,
  },
  {
    slug: 'patchwork',
    title: 'Patchwork',
    tagline: 'Every piece has a place.',
    para1:
      'In a neighbourhood being slowly erased by development, a retired tailor begins secretly documenting the community\'s stories in cloth. Patchwork celebrates ordinary lives through extraordinary craft.',
    para2:
      'Early development. Our most intimate project to date — a character study built entirely around hand-drawn animation and real community voices collected over two years.',
    img: deEvolutionImg,
  },
];

function ProjectEntry({ project }) {
  return (
    <article className="project-entry project-entry--split">
      <div className="project-text">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <p>{project.para1}</p>
        <p>{project.para2}</p>
      </div>
      <div className="project-image">
        <img src={project.img} alt={`${project.title} concept art`} loading="lazy" />
      </div>
    </article>
  );
}

function ComingSoonSection() {
  return (
    <section id="coming-soon" className="coming-soon-section coming-soon-section--cards">
      <div className="coming-soon-inner coming-soon-inner--cards">
        <div className="project-list project-list--split">
          {PROJECTS.map((project) => (
            <ProjectEntry key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Team ──────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Alex Rivera',
    role: 'Director & Co-Founder',
    blurb:
      'Alex brings over a decade of animation experience from feature films and short-form content, weaving traditional storytelling with cutting-edge digital techniques.',
    instagram: '#',
    linkedin: '#',
    website: '#',
  },
  {
    name: 'Sam Chen',
    role: 'Lead Animator',
    blurb:
      "Sam's fluid character work has been featured across indie festivals worldwide. Their passion for expressive motion drives the studio's visual identity.",
    instagram: '#',
    linkedin: '#',
  },
  {
    name: 'Jordan Walsh',
    role: 'Art Director',
    blurb:
      'Jordan shapes the visual language of every project, drawing from a background in fine arts and concept design for games and film.',
    instagram: '#',
    website: '#',
  },
];

function TeamLinks({ member }) {
  return (
    <div className="team-links">
      {member.instagram && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href={member.instagram} aria-label={`${member.name} on Instagram`}><FaInstagram /></a>
      )}
      {member.linkedin && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`}><FaLinkedin /></a>
      )}
      {member.website && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href={member.website} aria-label={`${member.name}'s website`}><FaGlobe /></a>
      )}
    </div>
  );
}

function TeamSection() {
  return (
    <section id="team" className="team-section">
      <h3>The Team</h3>

      <div className="team-grid team-grid--cards">
        {TEAM.map((member) => (
          <div className="team-card" key={member.name}>
            <div className="team-avatar" aria-hidden="true"><FaUser /></div>
            <div className="team-card-body">
              <h4 className="team-name">{member.name}</h4>
              <p className="team-role">{member.role}</p>
              <p className="team-blurb">{member.blurb}</p>
              <TeamLinks member={member} />
            </div>
          </div>
        ))}
      </div>

      <div className="team-cta">
        <a href={`${process.env.PUBLIC_URL}/team`} className="team-cta-btn">Meet the Full Team</a>
      </div>
    </section>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle');
  const lastSubmitRef = useRef(0);
  const COOLDOWN_MS = 30_000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (honeypot) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < COOLDOWN_MS) { setStatus('cooldown'); return; }
    lastSubmitRef.current = now;
    // TODO: wire to backend / email service (e.g. Formspree, Resend)
    setStatus('sent');
    setName(''); setEmail(''); setCategory(''); setInquiry('');
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <input type="text" name="website" style={{ display: 'none' }} tabIndex="-1"
        autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
        aria-hidden="true" />
      <input type="text" placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="" disabled>Inquiry Type</option>
        <option value="collaboration">Collaboration</option>
        <option value="commission">Commission</option>
        <option value="press">Press &amp; Media</option>
        <option value="general">General</option>
      </select>
      <textarea placeholder="Your message…" rows="5" value={inquiry}
        onChange={(e) => setInquiry(e.target.value)} required />
      <button type="submit" disabled={status === 'sent'}>
        {status === 'sent' ? 'Message Sent' : 'Send Message'}
      </button>
      {status === 'cooldown' && (
        <p className="form-notice">Please wait 30 seconds before sending again.</p>
      )}
      {status === 'sent' && (
        <p className="form-notice success">Thanks! We'll be in touch soon.</p>
      )}
    </form>
  );
}

const HOME_LINKS = [
  { href: '#about',       label: 'About' },
  { href: '#coming-soon', label: 'Coming Soon' },
  { href: `${process.env.PUBLIC_URL}/team`,        label: 'Team' },
  { href: '#contact',     label: 'Contact' },
];

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="App">

      <Navbar links={HOME_LINKS} homeHref="#hero" />

      <HeroBackground>
        <HeroTitle />
      </HeroBackground>

      <section id="about" className="about">
        <h3>About Us</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus
          augue a lectus pulvinar dignissim. Sed quis dui et dui pretium mollis.
          Quisque turpis nibh, sagittis vitae fringilla et, tincidunt in ipsum.
          Aenean at malesuada quam. Donec enim nibh, tincidunt eu metus ut,
          ornare viverra risus. Ut nisi turpis, ultricies et leo sit amet,
          placerat dapibus lorem.
        </p>
        <p>
          Vestibulum faucibus accumsan lectus eget dapibus. Donec non felis
          posuere, pharetra magna nec, eleifend felis. Phasellus volutpat dapibus
          tellus. Donec volutpat vitae diam ullamcorper mattis. Aenean varius
          suscipit elit. Aliquam massa tellus, venenatis non arcu id, pharetra
          viverra nisi. Suspendisse potenti.
        </p>
      </section>

      <ComingSoonSection />

      <TeamSection />

      <section id="contact" className="contact">
        <h3>Contact Us</h3>
        <p>Got a vision to animate? We'd love to hear from you.</p>
        <ContactForm />
      </section>

      <section className="socials" aria-label="Social links">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" aria-label="YouTube"><FaYoutube /></a>
        <a href="#contact" aria-label="Email"><FaEnvelope /></a>
      </section>

      <footer>
        © {new Date().getFullYear()} Scorched Animation. All rights reserved.
      </footer>

    </div>
  );
}

export default App;
