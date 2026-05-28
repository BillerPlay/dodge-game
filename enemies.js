// enemies.js — enemy spawn, movement, and collision

import * as config        from './config.js';
import { player }         from './player.js';
import { playCollision }  from './audio.js';
import { state }          from './state.js';
import { renderLives, renderScore, updateHighScore } from './ui.js';

const gameField = document.getElementById('gameField');

export let enemies = [];

// ─── Helpers ─────────────────────────────────────────────────────

function getRandomXPosition(size) {
  const zoneWidth = config.FIELD_WIDTH / 3;
  const zone      = Math.floor(Math.random() * 3);
  const x         = zone * zoneWidth + Math.random() * (zoneWidth - size);
  return Math.max(0, Math.min(config.FIELD_WIDTH - size, x));
}

function isColliding(e) {
  return (
    e.x < player.x + player.width  &&
    e.x + e.width  > player.x       &&
    e.y < player.y + player.height  &&
    e.y + e.height > player.y
  );
}

// ─── Lifecycle ───────────────────────────────────────────────────

function createEnemyEl(size, x, y) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    position:        'absolute',
    width:           size + 'px',
    height:          size + 'px',
    backgroundColor: '#ff335c',
    left:            '0',
    top:             '0',
    transform:       `translate(${x}px, ${y}px)`,
    willChange:      'transform',
    borderRadius:    '8px',
    boxShadow:       '0 0 15px #ff335c',
  });
  gameField.appendChild(el);
  return el;
}

export function createEnemy() {
  const size = Math.floor(Math.random() * 21) + 30;
  const x    = getRandomXPosition(size);
  const y    = -size - Math.random() * 300;

  const data = {
    width:  size,
    height: size,
    x,
    y,
    speed: Math.random() * 180 + 140,
    el:    createEnemyEl(size, x, y),
  };

  enemies.push(data);
}

export function resetEnemy(e) {
  const size = Math.floor(Math.random() * 21) + 30;
  e.width    = size;
  e.height   = size;
  e.el.style.width  = size + 'px';
  e.el.style.height = size + 'px';
  e.x     = getRandomXPosition(size);
  e.y     = -size - Math.random() * 400;
  e.speed = Math.random() * 240 + 300;
  e.el.style.transform = `translate(${e.x}px, ${e.y}px)`;
}

export function clearEnemies() {
  enemies.forEach(e => { if (e.el) e.el.remove(); });
  enemies = [];
}

// ─── Per-frame update ────────────────────────────────────────────

export function updateEnemies(dt, onDeath) {
  if (enemies.length < config.MAX_ENEMIES && Math.random() < 0.02) {
    createEnemy();
  }

  enemies.forEach(e => {
    e.y += e.speed * dt;

    if (isColliding(e)) {
      state.lives--;
      playCollision();
      renderLives(onDeath);
      if (state.lives > 0) resetEnemy(e);
      return;
    }

    if (e.y > config.FIELD_HEIGHT) {
      state.score += 10;
      renderScore();
      updateHighScore();
      resetEnemy(e);
    }

    e.el.style.transform = `translate(${e.x}px, ${e.y}px)`;
  });
}
