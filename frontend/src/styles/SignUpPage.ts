export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Layout shell ── */
  .er-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0b;
    color: #f0ede8;
    overflow: hidden;
  }

  /* ── Left visual panel ── */
  .er-visual {
    position: relative;
    flex: 1 1 50%;
    overflow: hidden;
    display: none;
  }
  @media (min-width: 900px) { .er-visual { display: block; } }

  .er-visual img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.4) saturate(1.2);
    transform: scale(1.04);
    transition: transform 12s ease;
  }
  .er-visual:hover img { transform: scale(1); }

  .er-visual::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      120deg,
      rgba(10,10,11,0.6) 0%,
      rgba(10,10,11,0.1) 50%,
      rgba(10,10,11,0.8) 100%
    );
  }
  .er-visual::before {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
    );
    z-index: 1; pointer-events: none;
  }

  .er-logo {
    position: absolute; top: 2.5rem; left: 2.5rem; z-index: 2;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; letter-spacing: 0.12em;
    color: #f0ede8;
    text-shadow: 0 0 40px rgba(255,200,80,0.4);
  }
  .er-tagline {
    position: absolute; bottom: 2.5rem; left: 2.5rem; right: 2.5rem; z-index: 2;
  }
  .er-tagline h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 300; line-height: 1.2; color: #f0ede8; margin: 0 0 0.5rem;
  }
  .er-tagline p {
    font-size: 0.85rem; color: rgba(240,237,232,0.5);
    letter-spacing: 0.06em; text-transform: uppercase; margin: 0;
  }

  /* ── Right form panel ── */
  .er-form-panel {
    flex: 1 1 50%;
    max-width: 540px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 2.5rem;
    background: #0a0a0b;
    position: relative;
    /* allow scroll on very small screens */
    overflow-y: auto;
    max-height: 100vh;
  }
  @media (min-width: 900px) {
    .er-form-panel { padding: 3rem 3rem; }
  }

  /* Ambient glows */
  .er-form-panel::before {
    content: '';
    position: absolute; top: -180px; right: -120px;
    width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,190,60,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .er-form-panel::after {
    content: '';
    position: absolute; bottom: -140px; left: -100px;
    width: 340px; height: 340px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,100,30,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Mobile logo */
  .er-mobile-logo {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 300; letter-spacing: 0.12em;
    color: #f0ede8; margin-bottom: 2rem;
  }
  @media (min-width: 900px) { .er-mobile-logo { display: none; } }

  .er-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 4vw, 3rem);
    font-weight: 300; line-height: 1.1; color: #f0ede8;
    margin: 0 0 0.35rem;
  }
  .er-subheading {
    font-size: 0.78rem; color: rgba(240,237,232,0.38);
    letter-spacing: 0.06em; text-transform: uppercase;
    margin: 0 0 1.8rem;
  }

  /* ── Two-column grid for name + email on wider screens ── */
  .er-grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }
  @media (min-width: 560px) {
    .er-grid-2 { grid-template-columns: 1fr 1fr; gap: 0 1rem; }
  }

  /* ── Fields ── */
  .er-field { margin-bottom: 1rem; }

  .er-label {
    display: block;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(240,237,232,0.4); margin-bottom: 0.4rem;
  }
  .er-input-wrap { position: relative; }

  .er-input-icon {
    position: absolute; left: 0.9rem; top: 50%;
    transform: translateY(-50%);
    opacity: 0.3; pointer-events: none;
    width: 15px; height: 15px; color: #f0ede8;
  }
  .er-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 0.8rem 0.9rem 0.8rem 2.6rem;
    font-size: 0.88rem;
    font-family: 'DM Sans', sans-serif;
    color: #f0ede8;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .er-input::placeholder { color: rgba(240,237,232,0.2); }
  .er-input:focus {
    border-color: rgba(255,190,60,0.5);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(255,190,60,0.07);
  }
  .er-input.er-input--error {
    border-color: rgba(255,107,107,0.45);
    box-shadow: 0 0 0 3px rgba(255,107,107,0.06);
  }

  /* ── Password strength checklist ── */
  .er-checks {
    margin-top: 0.6rem;
    padding: 0.75rem 0.9rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .er-check-row {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.75rem;
  }
  .er-check-icon {
    width: 14px; height: 14px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .er-check-icon--pass { background: rgba(74,222,128,0.15); color: #4ade80; }
  .er-check-icon--fail { background: rgba(255,107,107,0.1); color: rgba(240,237,232,0.25); }
  .er-check-label--pass { color: #4ade80; }
  .er-check-label--fail { color: rgba(240,237,232,0.35); }

  /* Strength bar */
  .er-strength-bar {
    height: 2px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    margin-top: 0.5rem;
    overflow: hidden;
  }
  .er-strength-fill {
    height: 100%; border-radius: 2px;
    transition: width 0.35s ease, background 0.35s ease;
  }

  /* ── Error message ── */
  .er-error {
    font-size: 0.78rem; color: #ff6b6b;
    background: rgba(255,107,107,0.09);
    border: 1px solid rgba(255,107,107,0.18);
    border-radius: 8px;
    padding: 0.6rem 0.9rem;
    margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 0.5rem;
  }

  /* ── Buttons ── */
  .er-btn-primary {
    width: 100%;
    padding: 0.88rem 1.5rem;
    background: linear-gradient(135deg, #ffbe3c 0%, #ff8c00 100%);
    color: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: none; border-radius: 10px; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255,190,60,0.22);
    margin-top: 0.5rem;
  }
  .er-btn-primary:hover {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(255,190,60,0.36);
  }
  .er-btn-primary:active { transform: translateY(0); opacity: 1; }

  /* ── Footer link ── */
  .er-footer-text {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(240,237,232,0.35);
    margin-top: 1.2rem;
  }
  .er-footer-link {
    color: #ffbe3c;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .er-footer-link:hover { opacity: 0.75; }

  /* ── Progress dots ── */
  .er-progress {
    display: flex; gap: 6px; margin-bottom: 1.8rem;
  }
  .er-dot {
    width: 20px; height: 3px; border-radius: 2px;
    background: rgba(255,255,255,0.12);
  }
  .er-dot--active { background: #ffbe3c; }
`;