function spawnElement() {
    let x = Math.random() * (canvas.width - 50);
    let type = Math.random() > 0.5 ? 'positive' : 'negative';
    elements.push(new Element(x, 0, type));
}

function update(timestamp) {
    if (gameState === 'playing') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // プレイヤーの描画
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // プレイヤーの移動
        if (leftPressed && player.x > 0) {
            player.x -= player.speed;
        }
        if (rightPressed && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }

        elements.forEach((element, index) => {
            element.update();
            element.draw();

            if (element.y > canvas.height) {
                elements.splice(index, 1);
            }

            // プレイヤーとの衝突判定
            if (
                player.x < element.x + 50 &&
                player.x + player.width > element.x &&
                player.y < element.y + 50 &&
                player.y + player.height > element.y
            ) {
                if (element.type === 'positive') {
                    scored.currentTime = 0;
                    scored.play();
                    score += 10;
                    document.getElementById('score').textContent = 'Score   : ' + score;
                } else {
                    hit.play();
                    endGame();
                }
                elements.splice(index, 1);
            }
        });
        elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('survived-time').textContent = 'Survived    : ' + elapsedTime+'s';

        // 一定間隔ごとに要素を生成
        if (timestamp - lastSpawnTime > spawnInterval) {
            spawnElement();
            lastSpawnTime = timestamp;
        }
    }
    
    animationFrameId = requestAnimationFrame(update);
}

function startGame() {
    if (gameState === 'not played') {
        startTime = Date.now();
        gameState = 'playing';
        document.getElementById('introduction').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('pause').style.display = 'none';
        document.getElementById('score').style.display = 'block';
        document.getElementById('survived-time').style.display = 'block';
        //document.getElementById('test').textContent = animationFrameId;
        document.getElementById('game-canvas').style.display = 'block';
        score = 0;
        survivedTime = 0;
        elements = [];
        player.x = canvas.width / 2 - 25;
        document.getElementById('score').textContent = 'Score: 0';
        bgm.play();
        update(0); // タイムスタンプ0で初期化して更新を開始
    }
}

function endGame() {
    gameState = 'game over';
    bgm.pause(); // BGMを停止
    bgm.currentTime = 0; // BGMの再生位置を先頭に戻す
    document.getElementById('game-over').style.display = 'block';
}

function resetGame() {
    player.speed = initialPlayerspeed;
    initialElementSpeed = 0.4;
    startTime = Date.now()
    score = 0;
    elapsedTime = 0;
    gameState = 'playing';
    elements = [];
    player.x = canvas.width / 2 - 25;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('survived-time').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('game-canvas').style.display = 'block';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    bgm.play();
    update(0); // タイムスタンプ0で初期化して更新を開始
}

function togglePause() {
    if (gameState === 'playing') {
        posedTime = Date.now()
        gameState = 'pause';
        bgm.pause();
        document.getElementById('pause').style.display = 'block';
    } else if (gameState === 'pause') {
        restartTime = Date.now()
        elapsedTime -= restartTime - posedTime
        gameState = 'playing';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        bgm.play();
        document.getElementById('pause').style.display = 'none';
        update(0);
    }
}

function home() {
    gameState = 'not played';
    document.getElementById('introduction').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('survived-time').style.display = 'none';
    document.getElementById('game-canvas').style.display = 'none';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}