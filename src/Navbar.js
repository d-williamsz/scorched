import React, { useState, useEffect } from 'react';
import './App.css';
import logoIcon    from './assets/Scorched_LogoIcon_500sq.png';
import navTextureSrc from './assets/Screenshot 2026-04-05 at 14.44.14.png';

// links: [{ href, label }]
export default function Navbar({ links = [], homeHref = '#hero' }) {
  const [flipTileUrl, setFlipTileUrl] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;
      const scale = Math.min(1, 150 / sh);
      const w = Math.round(sw * scale);
      const h = Math.round(sh * scale);

      const canvas = document.createElement('canvas');
      canvas.width  = w * 2;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, w, h);
      ctx.save();
      ctx.translate(w * 2, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();

      const sp = Math.max(6, Math.round(w * 0.05));
      const paintSeam = (cx, peak) => {
        const g = ctx.createLinearGradient(cx - sp, 0, cx + sp, 0);
        g.addColorStop(0,   'rgba(0,0,0,0)');
        g.addColorStop(0.5, `rgba(0,0,0,${peak})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - sp, 0, sp * 2, h);
      };

      paintSeam(w,     0.36);
      paintSeam(0,     0.20);
      paintSeam(w * 2, 0.20);

      setFlipTileUrl(canvas.toDataURL('image/jpeg', 0.90));
    };
    img.src = navTextureSrc;
  }, []);

  const navStyle = flipTileUrl ? { '--flip-tile-img': `url(${flipTileUrl})` } : undefined;

  return (
    <nav className="navbar navbar--texture-flip-tile" style={navStyle}>
      <div className="logo">
        <img src={logoIcon} alt="" aria-hidden="true" className="logo-icon" />
        <h1 className="logo-text">
          <a href={homeHref} aria-label="Scorched Animation — home" />
        </h1>
      </div>
      <ul className="nav-links">
        {links.map(({ href, label }) => (
          <li key={label}><a href={href}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
