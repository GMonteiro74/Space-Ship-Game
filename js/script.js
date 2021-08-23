const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

let currentGame;

let score = document.getElementById("score");
let lives = document.getElementById("lives");
lives.innerText = 5;
score.innerText = 0;

const startBtn = document.querySelector('#start');
startBtn.onclick = () => {
    startGame();
}

function startGame() {
    currentGame = new Game();
    currentGame.ship = new Player();
    currentGame.ship.draw();
    updateCanvas();
}

function shot(key) {
    if (key === "ArrowUp") {
        const newShot = new Bullet(currentGame.ship.x, currentGame.ship.y);
        currentGame.bullet.push(newShot);
    }

    for (const shots of currentGame.bullet) {
        shots.y -= 3;
        shots.draw();
    }

}


function drawEnemies() {
    currentGame.enemiesFrequency++;

    if (currentGame.enemiesFrequency % 379 === 0) {
        const randomEnemyX = Math.floor(Math.random() * 450);

    const newEnemy = new Enemy(randomEnemyX, 0);

    currentGame.enemies.push(newEnemy);
    }

    currentGame.enemies.forEach(((enemy, index) => {
        enemy.y += 0.5;
        enemy.draw();

        if (detectCollision(enemy)){
            currentGame.enemiesFrequency = 0;
            currentGame.enemies = [];
            alert('Game Over');
            
        }

        if (enemy.y > canvasHeight) {
            
            currentGame.lives--;
            lives.innerText = currentGame.lives;
            currentGame.enemies.splice(index, 1);
        }

        if (shotEnemy(enemy)) {
            currentGame.score++;
            score.innerText = currentGame.score;
            currentGame.enemies.splice(index, 1);

        }
    }))
}


function detectCollision(enemy) {
    return !(
        currentGame.ship.left() > enemy.right() ||
        currentGame.ship.right() < enemy.left() ||
        currentGame.ship.top() > enemy.bottom()
        
    )
    
}

function shotEnemy(enemy) {
    
    // for (const shot of currentGame.bullet) {
    //     return !(shot.left() > enemy.right() ||
    //     shot.right() < enemy.left() ||
    //     shot.top() > enemy.bottom()
    //     )
    // }

    currentGame.bullet.forEach(shot => {
        return !(shot.left() > enemy.right() ||
        shot.right() < enemy.left() ||
        shot.top() > enemy.bottom()
        )
    })
        
    
}


function updateCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    currentGame.ship.draw();
    drawEnemies();
    shot();
    requestAnimationFrame(updateCanvas);
}
    

document.addEventListener('keydown', (e) => {
    currentGame.ship.move(e.key);
    shot(e.key);

})





