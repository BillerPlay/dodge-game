const gameField = document.getElementById('gameField');

const FIELD_WIDTH = 480;
const FIELD_HEIGHT = 640;

const player = {
  width: 50,
  height: 50,
  x: FIELD_WIDTH / 2 - 25,
  y: FIELD_HEIGHT - 70,
  speed: 5,
  color: '#00ff88',
  el: null,
};

function createPlayer() {
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

function update() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;

  player.x = Math.max(0, Math.min(FIELD_WIDTH - player.width, player.x));

  player.el.style.left = player.x + 'px';
}

const enemy = {
  width: 40,
  height: 40,
  x: Math.random() * (FIELD_WIDTH - 40),
  y: -40,
  speed: 3,
  color: '#ff3333',
  el: null,
};

function createEnemy() {
  enemy.el = document.createElement('div');
  enemy.el.style.position = 'absolute';
  enemy.el.style.width = enemy.width + 'px';
  enemy.el.style.height = enemy.height + 'px';
  enemy.el.style.backgroundColor = enemy.color;
  enemy.el.style.left = enemy.x + 'px';
  enemy.el.style.top = enemy.y + 'px';
  gameField.appendChild(enemy.el);
}

function updateEnemy() {
  enemy.y += enemy.speed;

  if (enemy.y > FIELD_HEIGHT) {
    enemy.y = -enemy.height;
    enemy.x = Math.random() * (FIELD_WIDTH - enemy.width);
  }

  enemy.el.style.top = enemy.y + 'px';
  enemy.el.style.left = enemy.x + 'px';
}

function gameLoop() {
  update();
  updateEnemy();
  requestAnimationFrame(gameLoop);
}

createPlayer();
createEnemy();
gameLoop();