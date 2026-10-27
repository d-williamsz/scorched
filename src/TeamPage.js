import React, { useState } from 'react';
import './App.css';
import './TeamPage.css';
import {
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import Navbar from './Navbar';

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBTEAMS = [
  {
    name: 'Concept Art',
    members: [
      {
        name: 'Jordan Walsh',
        role: 'Art Director',
        blurb:
          'Jordan shapes the visual language of every project, drawing from a background in fine arts and concept design for games and film.',
        instagram: '#',
        website: '#',
      },
      {
        name: 'Maya Torres',
        role: 'Concept Artist',
        blurb:
          "Maya's detailed environment concepts set the tone for each production, blending realism with stylised warmth.",
        instagram: '#',
      },
      {
        name: 'Liam Park',
        role: 'Visual Development',
        blurb:
          'Liam bridges the gap between early sketches and final style guides, ensuring visual coherence across all projects.',
        linkedin: '#',
      },
    ],
  },
  {
    name: 'Storyboarding',
    members: [
      {
        name: 'Priya Nair',
        role: 'Lead Storyboard Artist',
        blurb:
          "Priya's cinematic sensibility transforms scripts into compelling visual narratives, establishing pacing and camera language.",
        instagram: '#',
        linkedin: '#',
      },
      {
        name: 'Oliver Kim',
        role: 'Storyboard Artist',
        blurb:
          'Oliver brings an instinctive sense of action and emotion to every board, with a background in graphic novels and short films.',
        instagram: '#',
      },
    ],
  },
  {
    name: 'Animation',
    members: [
      {
        name: 'Sam Chen',
        role: 'Lead Animator',
        blurb:
          "Sam's fluid character work has been featured across indie festivals worldwide. Their passion for expressive motion drives the studio's visual identity.",
        instagram: '#',
        linkedin: '#',
      },
      {
        name: 'Zara Ahmed',
        role: 'Character Animator',
        blurb:
          'Zara specialises in performance animation, breathing life into characters through subtle physicality and emotional nuance.',
        instagram: '#',
        website: '#',
      },
      {
        name: "Finn O'Brien",
        role: 'FX Animator',
        blurb:
          "Finn handles the studio's fire, water, and environmental effects — a fitting speciality for an animation studio called Scorched.",
        linkedin: '#',
      },
      {
        name: 'Tala Reyes',
        role: 'Animator',
        blurb:
          'Tala brings meticulous attention to secondary motion and weight, ensuring every scene feels grounded and alive.',
        instagram: '#',
      },
    ],
  },
  {
    name: 'Production',
    members: [
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
        name: 'Cleo Adeyemi',
        role: 'Producer',
        blurb:
          'Cleo orchestrates the moving parts of every production — budgets, schedules, and crew — ensuring ambitious visions reach the screen.',
        linkedin: '#',
      },
      {
        name: 'Marcus Webb',
        role: 'Technical Director',
        blurb:
          'Marcus builds and maintains the pipeline that makes everything possible, from render farms to custom tooling.',
        linkedin: '#',
        website: '#',
      },
    ],
  },
  {
    name: 'Social Media & Marketing',
    members: [
      {
        name: 'Yuki Sato',
        role: 'Social Media Manager',
        blurb:
          'Yuki crafts the online voice of Scorched Animation, building community and translating studio culture into shareable content.',
        instagram: '#',
        linkedin: '#',
      },
      {
        name: 'Danielle Cross',
        role: 'Marketing Strategist',
        blurb:
          'Danielle develops the broader communications strategy, from festival campaigns to press outreach and audience development.',
        linkedin: '#',
        website: '#',
      },
    ],
  },
  {
    name: 'Creative Direction',
    members: [
      {
        name: 'Alex Rivera',
        role: 'Director & Co-Founder',
        blurb:
          "Alex steers the creative vision of the studio, ensuring every project reflects Scorched Animation's commitment to authentic, community-grounded storytelling.",
        instagram: '#',
        linkedin: '#',
        website: '#',
      },
      {
        name: 'Jordan Walsh',
        role: 'Art Director',
        blurb:
          'Jordan works alongside Alex to define the aesthetic direction of each production, from colour palettes to typography.',
        instagram: '#',
        website: '#',
      },
    ],
  },
];

const TEAM_NAV_LINKS = [
  { href: `${process.env.PUBLIC_URL}/`,          label: 'Home' },
  { href: `${process.env.PUBLIC_URL}/#about`,    label: 'About' },
  { href: `${process.env.PUBLIC_URL}/#coming-soon`, label: 'Coming Soon' },
  { href: `${process.env.PUBLIC_URL}/#contact`,  label: 'Contact' },
];

// ── Card constants ─────────────────────────────────────────────────────────────
// Match the CSS card widths (260px desktop, 180px ≤600px mobile).
function getUnit() {
  if (typeof window !== 'undefined' && window.innerWidth <= 600) return 180 + 20; // 200
  return 260 + 28; // 288
}

const BG_SCALE   = 0.78;
const BG_OPACITY = 0.42;

const TRANSITION = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';

function cardStyle(i, activeStart, n) {
  const UNIT = getUnit();
  if (n === 1) {
    return {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
      zIndex: 2,
      pointerEvents: 'auto',
      transition: TRANSITION,
    };
  }

  let offset = ((i - activeStart) % n + n) % n;
  if (offset > Math.floor(n / 2)) offset -= n;

  const isSpot   = offset === 0 || offset === 1;
  const isVisible = Math.abs(offset) <= 2;
  const x = (offset - 0.5) * UNIT;

  return {
    transform: `translate(calc(-50% + ${x}px), -50%) scale(${isSpot ? 1 : BG_SCALE})`,
    opacity: isVisible ? (isSpot ? 1 : BG_OPACITY) : 0,
    zIndex:  isSpot ? 2 : 1,
    pointerEvents: isSpot ? 'auto' : 'none',
    transition: TRANSITION,
  };
}

// ── MemberLinks ───────────────────────────────────────────────────────────────
function MemberLinks({ member }) {
  return (
    <div className="team-links">
      {member.instagram && (
        <a href={member.instagram} aria-label={`${member.name} on Instagram`}><FaInstagram /></a>
      )}
      {member.linkedin && (
        <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`}><FaLinkedin /></a>
      )}
      {member.website && (
        <a href={member.website} aria-label={`${member.name}'s website`}><FaGlobe /></a>
      )}
    </div>
  );
}

// ── SubteamCarousel ───────────────────────────────────────────────────────────
function SubteamCarousel({ subteam }) {
  const { members } = subteam;
  const n = members.length;
  const [activeStart, setActiveStart] = useState(0);

  const prev = () => setActiveStart((s) => (s - 1 + n) % n);
  const next = () => setActiveStart((s) => (s + 1) % n);

  const showNav = n > 2;

  return (
    <div className="tp-carousel">
      <div className="tp-stage">
        {members.map((member, i) => {
          const style = cardStyle(i, activeStart, n);
          const isSpot = style.zIndex === 2;
          return (
            <div
              key={member.name}
              className={`tp-card-wrap${isSpot ? ' is-spot' : ''}`}
              style={style}
              aria-hidden={!isSpot}
            >
              <div className="tp-card">
                <div className="tp-avatar" aria-hidden="true"><FaUser /></div>
                <h4 className="team-name">{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-blurb">{member.blurb}</p>
                <MemberLinks member={member} />
              </div>
            </div>
          );
        })}
      </div>

      {showNav && (
        <div className="tp-carousel-nav">
          <button className="tp-nav-btn" onClick={prev} aria-label="Previous member">
            <FaChevronLeft />
          </button>
          <div className="tp-dots" role="tablist" aria-label={`${subteam.name} carousel position`}>
            {members.map((_, i) => (
              <button
                key={i}
                className={`tp-dot${i === activeStart ? ' active' : ''}`}
                onClick={() => setActiveStart(i)}
                aria-label={`Show ${members[i].name}`}
                role="tab"
                aria-selected={i === activeStart}
              />
            ))}
          </div>
          <button className="tp-nav-btn" onClick={next} aria-label="Next member">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

// ── TeamPage ──────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <div className="App">
      <Navbar links={TEAM_NAV_LINKS} homeHref={`${process.env.PUBLIC_URL}/`} />

      <div className="tp-page">
        <h1 className="tp-heading">The Team</h1>

        {SUBTEAMS.map((subteam) => (
          <section key={subteam.name} className="tp-subteam">
            <h2 className="tp-subteam-heading">{subteam.name}</h2>
            <SubteamCarousel subteam={subteam} />
          </section>
        ))}
      </div>
    </div>
  );
}
