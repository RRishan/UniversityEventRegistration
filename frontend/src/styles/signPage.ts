export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  .er-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0b;
    color: #f0ede8;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .er-visual {
    position: relative;
    flex: 1 1 55%;
    overflow: hidden;
    display: none;
  }
  @media (min-width: 900px) { .er-visual { display: block; } }

  .er-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.45) saturate(1.2);
    transform: scale(1.04);
    transition: transform 12s ease;
  }
  .er-visual:hover img { transform: scale(1); }

  /* Gradient overlay */
  .er-visual::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(10,10,11,0.55) 0%,
      rgba(10,10,11,0.15) 50%,
      rgba(10,10,11,0.75) 100%
    );
  }

  /* Scanline texture */
  .er-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
    z-index: 1;
    pointer-events: none;
  }

  .er-logo {
    position: absolute;
    top: 2.5rem;
    left: 2.5rem;
    z-index: 2;
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: #f0ede8;
    text-shadow: 0 0 40px rgba(255,200,80,0.4);
  }

  .er-tagline {
    position: absolute;
    bottom: 2.5rem;
    left: 2.5rem;
    right: 2.5rem;
    z-index: 2;
  }
  .er-tagline h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 300;
    line-height: 1.2;
    color: #f0ede8;
    margin: 0 0 0.5rem;
  }
  .er-tagline p {
    font-size: 0.85rem;
    color: rgba(240,237,232,0.5);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
  }

  /* ── Right panel ── */
  .er-form-panel {
    flex: 1 1 45%;
    max-width: 520px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 2.5rem;
    background: #0a0a0b;
    position: relative;
  }

  /* Mobile logo */
  .er-mobile-logo {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: #f0ede8;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 900px) { .er-mobile-logo { display: none; } }

  .er-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    font-weight: 300;
    line-height: 1.1;
    color: #f0ede8;
    margin: 0 0 0.4rem;
  }
  .er-subheading {
    font-size: 0.83rem;
    color: rgba(240,237,232,0.4);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 0 2.5rem;
  }

  /* ── Fields ── */
  .er-field {
    margin-bottom: 1.1rem;
  }
  .er-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(240,237,232,0.45);
    margin-bottom: 0.45rem;
  }
  .er-input-wrap {
    position: relative;
  }
  .er-input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.35;
    pointer-events: none;
    width: 16px;
    height: 16px;
    color: #f0ede8;
  }
  .er-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 0.85rem 1rem 0.85rem 2.75rem;
    font-size: 0.92rem;
    font-family: 'DM Sans', sans-serif;
    color: #f0ede8;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .er-input::placeholder { color: rgba(240,237,232,0.22); }
  .er-input:focus {
    border-color: rgba(255,190,60,0.55);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(255,190,60,0.08);
  }

  /* ── Row ── */
  .er-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.4rem 0 1.4rem;
    gap: 0.5rem;
  }
  .er-remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: rgba(240,237,232,0.4);
    cursor: pointer;
    user-select: none;
  }
  .er-remember input[type="checkbox"] {
    width: 15px;
    height: 15px;
    accent-color: #ffbe3c;
    cursor: pointer;
    border-radius: 4px;
  }
  .er-forgot {
    font-size: 0.8rem;
    color: rgba(240,237,232,0.4);
    text-decoration: none;
    transition: color 0.2s;
  }
  .er-forgot:hover { color: #ffbe3c; }

  /* ── Error ── */
  .er-error {
    font-size: 0.8rem;
    color: #ff6b6b;
    background: rgba(255,107,107,0.1);
    border: 1px solid rgba(255,107,107,0.2);
    border-radius: 8px;
    padding: 0.65rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* ── Buttons ── */
  .er-btn-primary {
    width: 100%;
    padding: 0.9rem 1.5rem;
    background: linear-gradient(135deg, #ffbe3c 0%, #ff8c00 100%);
    color: #0a0a0b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(255,190,60,0.25);
  }
  .er-btn-primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 32px rgba(255,190,60,0.38);
  }
  .er-btn-primary:active { transform: translateY(0); opacity: 1; }

  .er-divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
  }
  .er-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .er-divider span {
    position: relative;
    background: #0a0a0b;
    padding: 0 1rem;
    font-size: 0.75rem;
    color: rgba(240,237,232,0.25);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .er-btn-secondary {
    width: 100%;
    padding: 0.9rem 1.5rem;
    background: transparent;
    color: rgba(240,237,232,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .er-btn-secondary:hover {
    border-color: rgba(255,255,255,0.28);
    color: #f0ede8;
    background: rgba(255,255,255,0.04);
  }

  /* Subtle background accent */
  .er-form-panel::before {
    content: '';
    position: absolute;
    top: -180px;
    right: -120px;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(255,190,60,0.06) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }
  .er-form-panel::after {
    content: '';
    position: absolute;
    bottom: -140px;
    left: -100px;
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(255,100,30,0.05) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }
`;