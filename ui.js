// ui.js — HUD rendering, screens, and button wiring

import { state }                            from './state.js';
import { playClick, playOnButton, stopMusic, pauseMusic, resumeMusic } from './audio.js';

// ─── DOM refs ────────────────────────────────────────────────────

const livesEl             = document.getElementById('lives-hearts');
const scoreEl             = document.getElementById('score-value');
const gameHighScoreBox    = document.getElementById('highscore-box');
const gameHighScoreValue  = document.getElementById('highscore-value');
const menuHighScoreValue  = document.getElementById('menu-highscore-value');
const gameOverHighScore   = document.getElementById('game-over-highscore-value');
const finalScoreEl        = document.getElementById('final-score');

export const startScreen    = document.getElementById('start-screen');
export const pauseScreen    = document.getElementById('pause-screen');
export const gameOverScreen = document.getElementById('game-over-screen');
export const howToModal     = document.getElementById('how-to-modal');

const startBtn        = document.getElementById('start-btn');
const howToBtn        = document.getElementById('how-to-btn');
const restartBtn      = document.getElementById('restart-btn');
const resumeBtn       = document.getElementById('resume-btn');
const pauseMenuBtn    = document.getElementById('pause-menu-btn');
const gameoverMenuBtn = document.getElementById('gameover-menu-btn');
const closeModalBtn   = document.getElementById('close-modal-btn');

// ─── HUD ─────────────────────────────────────────────────────────

/** @param {() => void} [onZeroLives] */
export function renderLives(onZeroLives) {
  livesEl.textContent = '❤️'.repeat(Math.max(0, state.lives));
  if (state.lives <= 0 && onZeroLives) onZeroLives();
}

export function renderScore() {
  scoreEl.textContent = state.score;
}

// ─── High score ──────────────────────────────────────────────────

export function loadHighScore() {
  const saved     = localStorage.getItem('dodgeGame_highScore');
  state.highScore = saved !== null ? parseInt(saved, 10) : 0;
  syncHighScoreUI();
}

function syncHighScoreUI() {
  menuHighScoreValue.textContent  = state.highScore;
  gameOverHighScore.textContent   = state.highScore;
  gameHighScoreValue.textContent  = state.highScore;
  gameHighScoreBox.classList.toggle('hidden', state.highScore <= 0);
}

export function updateHighScore() {
  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem('dodgeGame_highScore', state.highScore);
    syncHighScoreUI();

    if (!scoreEl.classList.contains('pulse-glow-score')) {
      scoreEl.classList.add('pulse-glow-score');
    }
  }
}

// ─── Screen helpers ──────────────────────────────────────────────

export function showGameOver() {
  finalScoreEl.textContent = state.score;
  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
}

export function showStartScreen() {
  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

export function hideAllScreens() {
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');
}

export function showPauseScreen()  { pauseScreen.classList.remove('hidden'); }
export function hidePauseScreen()  { pauseScreen.classList.add('hidden'); }

export function clearScoreGlow() {
  scoreEl.classList.remove('pulse-glow-score');
}

// ─── Button wiring ───────────────────────────────────────────────

/**
 * Wire all menu buttons.
 * @param {{ onStart: fn, onRestart: fn, onResume: fn, onMenu: fn, onTogglePause: fn }} handlers
 */
export function initUI({ onStart, onRestart, onResume, onMenu, onTogglePause }) {
  function wire(btn, handler, hoverHandler = playOnButton) {
    btn.addEventListener('click',      () => { playClick(); handler(); });
    btn.addEventListener('mouseenter', hoverHandler);
  }

  wire(startBtn,        onStart);
  wire(restartBtn,      onRestart);
  wire(resumeBtn,       onResume);
  wire(pauseMenuBtn,    onMenu);
  wire(gameoverMenuBtn, onMenu);
  wire(howToBtn,        () => howToModal.classList.remove('hidden'));
  wire(closeModalBtn,   () => howToModal.classList.add('hidden'));
}
