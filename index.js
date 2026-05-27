const gameField = document.getElementById('gameField');

const FIELD_WIDTH = 480;
const FIELD_HEIGHT = 640;

const player = {
  width: 50,
  height: 50,
  x: FIELD_WIDTH / 2 - 25,
  y: FIELD_HEIGHT - 70,
  speed: 360,
  color: '#00ff88',
  el: null,
};

function createPlayer() {
  if (player.el) return;
  player.el = document.createElement('div');
  player.el.style.position = 'absolute';
  player.el.style.width = player.width + 'px';
  player.el.style.height = player.height + 'px';
  player.el.style.backgroundColor = player.color;
  player.el.style.left = player.x + 'px';
  player.el.style.top = player.y + 'px';
  player.el.style.borderRadius = '10px';
  player.el.style.boxShadow = '0 0 20px #00ff88, inset 0 0 10px rgba(255,255,255,0.5)';
  gameField.appendChild(player.el);
}

const keys = { left: false, right: false };

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.key === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.key === 'Escape' && !e.repeat) {
    if (isGameActive) togglePause();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.key === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
});

function update(dt) {
  if (keys.left) player.x -= player.speed * dt;
  if (keys.right) player.x += player.speed * dt;
  player.x = Math.max(0, Math.min(FIELD_WIDTH - player.width, player.x));
  player.el.style.left = player.x + 'px';
}

let enemies = [];
const MAX_ENEMIES = 6;

function getRandomXPosition(enemySize) {
  const zone = Math.floor(Math.random() * 3);
  const zoneWidth = FIELD_WIDTH / 3;
  const x = (zone * zoneWidth) + Math.random() * (zoneWidth - enemySize);
  return Math.max(0, Math.min(FIELD_WIDTH - enemySize, x));
}

function createEnemy() {
  const size = Math.floor(Math.random() * 21) + 30;
  const enemyData = {
    width: size,
    height: size,
    x: getRandomXPosition(size),
    y: -size - Math.random() * 300,
    speed: Math.random() * 180 + 140,
    color: '#ff335c',
    el: document.createElement('div')
  };

  enemyData.el.style.position = 'absolute';
  enemyData.el.style.width = enemyData.width + 'px';
  enemyData.el.style.height = enemyData.height + 'px';
  enemyData.el.style.backgroundColor = enemyData.color;
  enemyData.el.style.left = enemyData.x + 'px';
  enemyData.el.style.top = enemyData.y + 'px';
  enemyData.el.style.borderRadius = '8px';
  enemyData.el.style.boxShadow = '0 0 15px #ff335c';

  gameField.appendChild(enemyData.el);
  enemies.push(enemyData);
}

function resetEnemy(enemyData) {
  const size = Math.floor(Math.random() * 21) + 30;
  enemyData.width = size;
  enemyData.height = size;
  enemyData.el.style.width = size + 'px';
  enemyData.el.style.height = size + 'px';
  enemyData.x = getRandomXPosition(size);
  enemyData.y = -size - Math.random() * 400;
  enemyData.speed = Math.random() * 240 + 300;
}

function isColliding(enemyData) {
  return (
    enemyData.x < player.x + player.width &&
    enemyData.x + enemyData.width > player.x &&
    enemyData.y < player.y + player.height &&
    enemyData.y + enemyData.height > player.y
  );
}

function updateEnemies(dt) {
  if (enemies.length < MAX_ENEMIES && Math.random() < 0.02) {
    createEnemy();
  }

  enemies.forEach((enemyData) => {
    enemyData.y += enemyData.speed * dt;

    if (isColliding(enemyData)) {
      lives--;
      playCollision();
      renderLives();
      if (lives > 0) resetEnemy(enemyData);
    }

    if (enemyData.y > FIELD_HEIGHT) {
      score += 10;
      renderScore();
      updateHighScore();
      resetEnemy(enemyData);
    }

    enemyData.el.style.top = enemyData.y + 'px';
    enemyData.el.style.left = enemyData.x + 'px';
  });
}

let lives = 3;
let score = 0;
let isGameActive = false;
let isPaused = false;
let highScore = 0;

const bgMusic      = document.getElementById('bg-music');
const sfxClick     = document.getElementById('sfx-click');
const sfxOnButton     = document.getElementById('sfx-on-button');
const sfxCollision = document.getElementById('sfx-collision');
let musicVolume   = 50;
let effectsVolume = 50;

const musicVolumeSliders    = document.querySelectorAll('#music-volume');
const effectsVolumeSliders  = document.querySelectorAll('#effects-volume');
const musicVolumeValueEls   = document.querySelectorAll('#music-volume-value');
const effectsVolumeValueEls = document.querySelectorAll('#effects-volume-value');

function updateSliderTrack(slider) {
  const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--track-fill', `${val}%`);
}

function applyMusicVolume(val) {
  musicVolume = val;
  bgMusic.volume = musicVolume / 100;
  localStorage.setItem('dodgeGame_musicVolume', musicVolume);
  musicVolumeSliders.forEach(s => { s.value = val; updateSliderTrack(s); });
  musicVolumeValueEls.forEach(el => { el.textContent = val; });
}

function applyEffectsVolume(val) {
  effectsVolume = val;
  localStorage.setItem('dodgeGame_effectsVolume', effectsVolume);
  effectsVolumeSliders.forEach(s => { s.value = val; updateSliderTrack(s); });
  effectsVolumeValueEls.forEach(el => { el.textContent = val; });
}

function loadAudioSettings() {
  const savedMusic   = localStorage.getItem('dodgeGame_musicVolume');
  const savedEffects = localStorage.getItem('dodgeGame_effectsVolume');
  applyMusicVolume(savedMusic     !== null ? parseInt(savedMusic,   10) : 50);
  applyEffectsVolume(savedEffects !== null ? parseInt(savedEffects, 10) : 50);
}

musicVolumeSliders.forEach(slider => {
  slider.addEventListener('input', () => applyMusicVolume(parseInt(slider.value, 10)));
});

effectsVolumeSliders.forEach(slider => {
  slider.addEventListener('input', () => applyEffectsVolume(parseInt(slider.value, 10)));
});


function playClick() {
  const s = sfxClick.cloneNode();
  s.volume = effectsVolume / 100;
  s.play().catch(() => {});
}

function playOnButton() {
  const s = sfxOnButton.cloneNode();
  s.volume = effectsVolume / 100;
  s.play().catch(() => {});
}

function playCollision() {
  const s = sfxCollision.cloneNode();
  s.volume = effectsVolume / 100;
  s.play().catch(() => {});
}

function playMusic() {
  bgMusic.currentTime = 0;
  bgMusic.volume = musicVolume / 100;
  bgMusic.play().catch(() => {});
}

function stopMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

const livesEl = document.getElementById('lives-hearts');
const scoreEl = document.getElementById('score-value');
const gameHighScoreBox = document.getElementById('highscore-box');
const gameHighScoreValue = document.getElementById('highscore-value');
const startScreen = document.getElementById('start-screen');
const pauseScreen = document.getElementById('pause-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

const menuHighScoreValue = document.getElementById('menu-highscore-value');
const gameOverHighScoreValue = document.getElementById('game-over-highscore-value');

const startBtn = document.getElementById('start-btn');
const howToBtn = document.getElementById('how-to-btn');
const restartBtn = document.getElementById('restart-btn');
const resumeBtn = document.getElementById('resume-btn');
const pauseMenuBtn = document.getElementById('pause-menu-btn');
const gameoverMenuBtn = document.getElementById('gameover-menu-btn');
const howToModal = document.getElementById('how-to-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

function loadHighScore() {
  const savedScore = localStorage.getItem('dodgeGame_highScore');
  highScore = savedScore !== null ? parseInt(savedScore, 10) : 0;

  menuHighScoreValue.textContent = highScore;
  gameOverHighScoreValue.textContent = highScore;
  gameHighScoreValue.textContent = highScore;

  if (highScore > 0) {
    gameHighScoreBox.classList.remove('hidden');
  } else {
    gameHighScoreBox.classList.add('hidden');
  }
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('dodgeGame_highScore', highScore);

    gameOverHighScoreValue.textContent = highScore;
    menuHighScoreValue.textContent = highScore;
    gameHighScoreValue.textContent = highScore;

    if (highScore > 0) {
      gameHighScoreBox.classList.remove('hidden');
      if (!scoreEl.classList.contains('pulse-glow-score')) {
        scoreEl.classList.add('pulse-glow-score');
      }
    }
  }
}

function renderLives() {
  livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
  if (lives <= 0) {
    endGame();
  }
}

function renderScore() {
  scoreEl.textContent = score;
}

function startGame() {
  lives = 3;
  score = 0;
  isPaused = false;
  renderScore();
  renderLives();

  player.x = FIELD_WIDTH / 2 - player.width / 2;

  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');

  createPlayer();

  isGameActive = true;
  scoreEl.classList.remove('pulse-glow-score');

  playMusic();
}

function endGame() {
  isGameActive = false;
  isPaused = false;
  updateHighScore();
  finalScoreEl.textContent = score;
  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');

  enemies.forEach(enemy => { if (enemy.el) enemy.el.remove(); });
  enemies = [];

  stopMusic();
}

function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseScreen.classList.remove('hidden');
    bgMusic.pause();
  } else {
    pauseScreen.classList.add('hidden');
    bgMusic.play().catch(() => {});
  }
}

function goToMainMenu() {
  isGameActive = false;
  isPaused = false;

  enemies.forEach(enemy => { if (enemy.el) enemy.el.remove(); });
  enemies = [];

  if (player.el) {
    player.el.remove();
    player.el = null;
  }

  pauseScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');

  score = 0;
  lives = 3;
  renderScore();
  renderLives();
  scoreEl.classList.remove('pulse-glow-score');

  stopMusic();
}

startBtn.addEventListener('click', () => { playClick(); startGame(); });
startBtn.addEventListener('mouseenter', playOnButton);
restartBtn.addEventListener('click', () => { playClick(); startGame(); });
restartBtn.addEventListener('mouseenter', playOnButton);
resumeBtn.addEventListener('click', () => { playClick(); togglePause(); });
resumeBtn.addEventListener('mouseenter', playOnButton);
pauseMenuBtn.addEventListener('click', () => { playClick(); goToMainMenu(); });
pauseMenuBtn.addEventListener('mouseenter', playOnButton);
gameoverMenuBtn.addEventListener('click', () => { playClick(); goToMainMenu(); });
gameoverMenuBtn.addEventListener('mouseenter', playOnButton);

howToBtn.addEventListener('click', () => { playClick(); howToModal.classList.remove('hidden'); });
howToBtn.addEventListener('mouseenter', playOnButton);
closeModalBtn.addEventListener('click', () => { playClick(); howToModal.classList.add('hidden'); });
closeModalBtn.addEventListener('mouseenter', playOnButton);

let lastTime = 0;

function gameLoop(currentTime) {
  let dt = (currentTime - lastTime) / 1000;
  if (dt > 0.1) dt = 0.1;
  lastTime = currentTime;

  if (isGameActive && !isPaused) {
    update(dt);
    updateEnemies(dt);
  }

  requestAnimationFrame(gameLoop);
}

loadHighScore();
loadAudioSettings();
renderLives();
renderScore();

requestAnimationFrame((time) => {
  lastTime = time;
  gameLoop(time);
});