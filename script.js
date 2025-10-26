const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const buttons = document.querySelectorAll('.btn');

let width, height, cellSize = 25;
let cols, rows;
let maze = [];
let player, chaser;
let gameOver = false;

// 방향키 입력
let dir = { x: 0, y: 0 };

// 모바일 터치 조작
buttons.forEach(btn => {
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    const d = e.target.dataset.dir;
    if (d === 'up') dir = { x: 0, y: -1 };
    if (d === 'down') dir = { x: 0, y: 1 };
    if (d === 'left') dir = { x: -1, y: 0 };
    if (d === 'right') dir = { x: 1, y: 0 };
  });
});

// 키보드 방향키
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') dir = { x: 0, y: -1 };
  if (e.key === 'ArrowDown') dir = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft') dir = { x: -1, y: 0 };
  if (e.key === 'ArrowRight') dir = { x: 1, y: 0 };
});

// 화면 크기에 맞게 설정
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  cols = Math.floor(width / cellSize);
  rows = Math.floor(height / cellSize);
}
resize();
window.addEventListener('resize', resize);

// 미로 생성 (단순 랜덤 벽)
function createMaze() {
  maze = [];
  for (let y = 0; y < rows; y++) {
    maze[y] = [];
    for (let x = 0; x < cols; x++) {
      maze[y][x] = Math.random() < 0.2 ? 1 : 0; // 1은 벽
    }
  }
  // 테두리는 벽
  for (let i = 0; i < cols; i++) {
    maze[0][i] = maze[rows - 1][i] = 1;
  }
  for (let i = 0; i < rows; i++) {
    maze[i][0] = maze[i][cols - 1] = 1;
  }
}

// 플레이어와 추격자 초기화
function initGame() {
  createMaze();
  player = { x: 1, y: 1 };
  chaser = { x: cols - 2, y: rows - 2 };
  dir = { x: 0, y: 0 };
  gameOver = false;
}
initGame();

// 충돌 검사
function canMove(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return false;
  return maze[y][x] === 0;
}

// 추격자 움직임 (플레이어 방향으로)
function moveChaser() {
  let dx = player.x - chaser.x;
  let dy = player.y - chaser.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    chaser.x += Math.sign(dx);
  } else {
    chaser.y += Math.sign(dy);
  }
  // 벽이면 움직이지 않음
  if (!canMove(chaser.x, chaser.y)) {
    chaser.x -= Math.sign(dx);
    chaser.y -= Math.sign(dy);
  }
}

// 게임 루프
function update() {
  if (gameOver) return;

  let newX = player.x + dir.x;
  let newY = player.y + dir.y;
  if (canMove(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }

  moveChaser();

  if (player.x === chaser.x && player.y === chaser.y) {
    gameOver = true;
    alert('잡혔습니다! 😱 다시 시작합니다.');
    initGame();
  }
}

// 그리기
function draw() {
  ctx.clearRect(0, 0, width, height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = '#333';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // 플레이어 (검은색)
  ctx.fillStyle = 'black';
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

  // 추격자 (파란색)
  ctx.fillStyle = 'blue';
  ctx.fillRect(chaser.x * cellSize, chaser.y * cellSize, cellSize, cellSize);
}

// 루프
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
