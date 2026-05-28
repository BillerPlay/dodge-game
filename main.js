// main.js — entry point and game loop

import { updateFieldDimensions, MAX_DT } from './config.js';
import { state }                          from './state.js';
import { initInput }                      from './input.js';
import { loadAudioSettings, playMusic, stopMusic, pauseMusic, resumeMusic } from './audio.js';
import { initPlayer, updatePlayer, destroyPlayer } from './player.js';
import { updateEnemies, clearEnemies }    from './enemies.js';
import {
  loadHighScore, renderLives, renderScore, updateHighScore,
  showGameOver, showStartScreen, hideAllScreens,
  showPauseScreen, hidePauseScreen, clearScoreGlow,
  initUI,
} from './ui.js';
import { initMobileControls }             from './mobile.js';

// ─── Game actions ────────────────────────────────────────────────

function startGame() {
  state.lives       = 3;
  state.score       = 0;
  state.isPaused    = false;
  state.isGameActive = true;

  renderScore();
  renderLives();
  clearScoreGlow();
  hideAllScreens();
  initPlayer();
  playMusic();
}

function endGame() {
  state.isGameActive = false;
  state.isPaused     = false;

  updateHighScore();
  showGameOver();
  clearEnemies();
  stopMusic();
}

function togglePause() {
  state.isPaused = !state.isPaused;

  if (state.isPaused) {
    showPauseScreen();
    pauseMusic();
  } else {
    hidePauseScreen();
    resumeMusic();
  }
}

function goToMainMenu() {
  state.isGameActive = false;
  state.isPaused     = false;
  state.score        = 0;
  state.lives        = 3;

  clearEnemies();
  destroyPlayer();
  showStartScreen();
  renderScore();
  renderLives();
  clearScoreGlow();
  stopMusic();
}

// ─── Game loop ───────────────────────────────────────────────────

let lastTime = 0;

function gameLoop(currentTime) {
  let dt = (currentTime - lastTime) / 1000;
  if (dt > MAX_DT) dt = MAX_DT;
  lastTime = currentTime;

  if (state.isGameActive && !state.isPaused) {
    updatePlayer(dt);
    updateEnemies(dt, endGame);   // endGame is the "on zero lives" callback
  }

  requestAnimationFrame(gameLoop);
}

// ─── Boot ────────────────────────────────────────────────────────

window.addEventListener('resize', updateFieldDimensions);

initInput(() => { if (state.isGameActive) togglePause(); });

initUI({
  onStart:       startGame,
  onRestart:     startGame,
  onResume:      togglePause,
  onMenu:        goToMainMenu,
  onTogglePause: togglePause,
});

initMobileControls(togglePause);

loadHighScore();
loadAudioSettings();
renderLives();
renderScore();

requestAnimationFrame((time) => {
  lastTime = time;
  gameLoop(time);
});
