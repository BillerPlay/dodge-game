// player.js — player entity

import { keys }                                    from './input.js';
import { FIELD_WIDTH, FIELD_HEIGHT, PLAYER_SPEED } from './config.js';
import * as config                                  from './config.js';

const gameField = document.getElementById('gameField');

export const player = {
  width:  50,
  height: 50,
  x:      0,
  y:      0,
  el:     null,
};

export function initPlayer() {
  player.x = config.FIELD_WIDTH  / 2 - player.width  / 2;
  player.y = config.FIELD_HEIGHT - 70;

  if (player.el) {
    player.el.style.transform = `translate(${player.x}px, ${player.y}px)`;
    return;
  }

  player.el = document.createElement('div');
  Object.assign(player.el.style, {
    position:        'absolute',
    width:           player.width  + 'px',
    height:          player.height + 'px',
    backgroundColor: '#00ff88',
    left:            '0',
    top:             '0',
    transform:       `translate(${player.x}px, ${player.y}px)`,
    willChange:      'transform',
    borderRadius:    '10px',
    boxShadow:       '0 0 20px #00ff88, inset 0 0 10px rgba(255,255,255,0.5)',
  });
  gameField.appendChild(player.el);
}

export function destroyPlayer() {
  if (player.el) {
    player.el.remove();
    player.el = null;
  }
}

export function updatePlayer(dt) {
  if (keys.left)  player.x -= PLAYER_SPEED * dt;
  if (keys.right) player.x += PLAYER_SPEED * dt;
  // Use live value from config object so resize is respected
  player.x = Math.max(0, Math.min(config.FIELD_WIDTH - player.width, player.x));
  player.el.style.transform = `translate(${player.x}px, ${player.y}px)`;
}
