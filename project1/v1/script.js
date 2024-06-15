let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameState = 'not played';  // 'not played', 'playing', 'pause', 'game over'
let initialPlayerspeed = 1;
let player = { 
    x: canvas.width / 2 - 25, 
    y: canvas.height - 60, 
    width: 50, 
    height: 50,
    speed: initialPlayerspeed
};
let animationFrameId = 0; // requestAnimationFrame のIDを管理する変数
let elements = [];
let initialElementSpeed = 0.4;
let leftPressed = false;
let rightPressed = false;
let lastSpawnTime = 0;
let spawnInterval = 600; // 要素を生成する間隔（ミリ秒）
let startTime;
let posedTime;
let restartTime;
let elapsedTime = 0;

class Element {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = initialElementSpeed;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.type === 'positive' ? 'green' : 'red';
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

document.getElementById('introduction').style.display = 'block';

//function from /function/function.js

spawnElement();

update();

startGame();

resetGame();

togglePause();

home();

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', resetGame);
document.getElementById('home-btn').addEventListener('click', home);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        leftPressed = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        rightPressed = true;
    } else if (e.key === 'Escape' || e.key === 's') {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        rightPressed = false;
    }
});

update(0);
