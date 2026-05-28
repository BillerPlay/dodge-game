// mobile.js — mobile controls and HUD sync

import { keys }     from './input.js';
import { state }    from './state.js';
import { playClick } from './audio.js';

export function initMobileControls(onPause) {
  const mobileControls = document.getElementById('mobile-controls');
  const mobileLeft     = document.getElementById('mobile-left');
  const mobileRight    = document.getElementById('mobile-right');
  const mobilePauseBtn = document.getElementById('mobile-pause');
  const mobileLives    = document.getElementById('mobile-lives');
  const mobileScore    = document.getElementById('mobile-score');

  if (!mobileControls) return;

  // ─── Visibility ───────────────────────────────────────────────

  const gameField = document.getElementById('gameField');

  function checkMobile() {
    mobileControls.style.display = window.innerWidth <= 520 ? 'flex' : 'none';
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // ─── HUD sync ─────────────────────────────────────────────────

  setInterval(() => {
    if (mobileLives) mobileLives.textContent = '❤️'.repeat(Math.max(0, state.lives));
    if (mobileScore) mobileScore.textContent = state.score;
  }, 100);

  // ─── D-pad hold ───────────────────────────────────────────────

  function addHoldBehavior(btn, keyName) {
    const press = (e) => {
      e.preventDefault();
      keys[keyName] = true;
      btn.classList.add('pressed');
    };
    const release = (e) => {
      e.preventDefault();
      keys[keyName] = false;
      btn.classList.remove('pressed');
    };

    btn.addEventListener('touchstart',   press,   { passive: false });
    btn.addEventListener('touchend',     release, { passive: false });
    btn.addEventListener('touchcancel',  release, { passive: false });
    btn.addEventListener('pointerdown',  press,   { passive: false });
    btn.addEventListener('pointerup',    release, { passive: false });
    btn.addEventListener('pointerleave', release, { passive: false });
  }

  addHoldBehavior(mobileLeft,  'left');
  addHoldBehavior(mobileRight, 'right');

  // ─── Pause button ─────────────────────────────────────────────

  mobilePauseBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (state.isGameActive) { playClick(); onPause(); }
  }, { passive: false });

  mobilePauseBtn.addEventListener('click', () => {
    if (state.isGameActive) { playClick(); onPause(); }
  });

  // ─── Field height fix ─────────────────────────────────────────

  function adjustFieldHeight() {
    if (window.innerWidth > 520) return;
    const controlsH = mobileControls.offsetHeight || 80;
    gameField.style.height = (window.innerHeight - controlsH) + 'px';
  }
  adjustFieldHeight();
  window.addEventListener('resize', adjustFieldHeight);
}
