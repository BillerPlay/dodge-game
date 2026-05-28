// audio.js — music and sound effects

const bgMusic      = document.getElementById('bg-music');
const sfxClick     = document.getElementById('sfx-click');
const sfxOnButton  = document.getElementById('sfx-on-button');
const sfxCollision = document.getElementById('sfx-collision');

export let musicVolume   = 50;
export let effectsVolume = 50;

// ─── Volume helpers ──────────────────────────────────────────────

function updateSliderTrack(slider) {
  const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--track-fill', `${val}%`);
}

export function applyMusicVolume(val) {
  musicVolume       = val;
  bgMusic.volume    = musicVolume / 100;
  localStorage.setItem('dodgeGame_musicVolume', musicVolume);

  document.querySelectorAll('#music-volume').forEach(s => {
    s.value = val;
    updateSliderTrack(s);
  });
  document.querySelectorAll('#music-volume-value').forEach(el => {
    el.textContent = val;
  });
}

export function applyEffectsVolume(val) {
  effectsVolume = val;
  localStorage.setItem('dodgeGame_effectsVolume', effectsVolume);

  document.querySelectorAll('#effects-volume').forEach(s => {
    s.value = val;
    updateSliderTrack(s);
  });
  document.querySelectorAll('#effects-volume-value').forEach(el => {
    el.textContent = val;
  });
}

export function loadAudioSettings() {
  const savedMusic   = localStorage.getItem('dodgeGame_musicVolume');
  const savedEffects = localStorage.getItem('dodgeGame_effectsVolume');
  applyMusicVolume(  savedMusic   !== null ? parseInt(savedMusic,   10) : 50);
  applyEffectsVolume(savedEffects !== null ? parseInt(savedEffects, 10) : 50);

  document.querySelectorAll('#music-volume').forEach(slider => {
    slider.addEventListener('input', () =>
      applyMusicVolume(parseInt(slider.value, 10)));
  });
  document.querySelectorAll('#effects-volume').forEach(slider => {
    slider.addEventListener('input', () =>
      applyEffectsVolume(parseInt(slider.value, 10)));
  });
}

// ─── Playback ────────────────────────────────────────────────────

function cloneAndPlay(source) {
  const s = source.cloneNode();
  s.volume = effectsVolume / 100;
  s.play().catch(() => {});
}

export const playClick     = () => cloneAndPlay(sfxClick);
export const playOnButton  = () => cloneAndPlay(sfxOnButton);
export const playCollision = () => cloneAndPlay(sfxCollision);

export function playMusic() {
  bgMusic.currentTime = 0;
  bgMusic.volume      = musicVolume / 100;
  bgMusic.play().catch(() => {});
}

export function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

export function pauseMusic()  { bgMusic.pause(); }
export function resumeMusic() { bgMusic.play().catch(() => {}); }
