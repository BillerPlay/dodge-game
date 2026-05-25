const gameField = document.getElementById('gameField');

const FIELD_WIDTH = 480;
const FIELD_HEIGHT = 640;

const player = {
  width: 50,
  height: 50,
  x: FIELD_WIDTH / 2 - 25,
  y: FIELD_HEIGHT - 70,
  speed: 300, 
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
  gameField.appendChild(player.el);
}

const keys = {
  left: false,
  right: false,
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.key === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
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
const MAX_ENEMIES = 7; 

function getRandomXPosition(enemySize) {
  const zone = Math.floor(Math.random() * 3);
  const zoneWidth = FIELD_WIDTH / 3;          
  
  let x = (zone * zoneWidth) + Math.random() * (zoneWidth - enemySize);
  
  return Math.max(0, Math.min(FIELD_WIDTH - enemySize, x));
}

function createEnemy() {
  const size = Math.floor(Math.random() * 21) + 30;
  
  const enemyData = {
    width: size,
    height: size,
    x: getRandomXPosition(size),
    y: -size - Math.random() * 300,
    speed: Math.random() * 180 + 120, 
    color: '#ff3333',
    el: document.createElement('div')
  };

  enemyData.el.style.position = 'absolute';
  enemyData.el.style.width = enemyData.width + 'px';
  enemyData.el.style.height = enemyData.height + 'px';
  enemyData.el.style.backgroundColor = enemyData.color;
  enemyData.el.style.left = enemyData.x + 'px';
  enemyData.el.style.top = enemyData.y + 'px';
  
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
      renderLives();
      if (lives > 0) resetEnemy(enemyData);
    }

    if (enemyData.y > FIELD_HEIGHT) {
      score += 10;
      renderScore();
      resetEnemy(enemyData);
    }

    enemyData.el.style.top = enemyData.y + 'px';
    enemyData.el.style.left = enemyData.x + 'px';
  });
}

let lives = 3;
let score = 0;
let isGameActive = false;

const livesEl = document.getElementById('lives-hearts');
const scoreEl = document.getElementById('score-value');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

const startBtn = document.getElementById('start-btn');
const howToBtn = document.getElementById('how-to-btn');
const restartBtn = document.getElementById('restart-btn');
const howToModal = document.getElementById('how-to-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

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
  renderScore();
  renderLives();

  player.x = FIELD_WIDTH / 2 - player.width / 2;

  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');

  createPlayer();
  
  isGameActive = true;
}

function endGame() {
  isGameActive = false;

  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove('hidden');

  enemies.forEach(enemy => {
    if (enemy.el) enemy.el.remove();
  });
  enemies = [];
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

howToBtn.addEventListener('click', () => {
  howToModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  howToModal.classList.add('hidden');
});

let lastTime = 0;

function gameLoop(currentTime) {
  let dt = (currentTime - lastTime) / 1000;
  if (dt > 0.1) dt = 0.1; 
  lastTime = currentTime;

  if (isGameActive) {
    update(dt);
    updateEnemies(dt);
  }
  
  requestAnimationFrame(gameLoop);
}

renderLives();
renderScore();

requestAnimationFrame((time) => {
  lastTime = time;
  gameLoop(time);
});