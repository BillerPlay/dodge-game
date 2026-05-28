// input.js — keyboard input handling

export const keys = { left: false, right: false };

/** @param {() => void} onEscape — called when Escape is pressed during an active game */
export function initInput(onEscape) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft'  || e.code === 'KeyA') keys.left  = true;
    if (e.key === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.key === 'Escape' && !e.repeat) onEscape();
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft'  || e.code === 'KeyA') keys.left  = false;
    if (e.key === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  });
}
