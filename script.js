let ballX, ballY, ballSpeedX, ballSpeedY, leftPaddleSpeed, rightPaddleSpeed, leftScore = 0, rightScore = 0, gameStarted = false;
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('startButton');
const restarttButton = document.getElementById('restart');

function startGame() {
    ball.style = 'opacity :1;'
    startButton.innerHTML = '';
    startButton.textContent = 'Reset'
    // Reset all game variables and elements
    leftScore = 0;
    rightScore = 0;
    updateScoreDisplay();

    ballX = 300;
    ballY = 200;

    // Set ball speed based on the selected difficulty
    ballSpeedX = getBallSpeed();
    ballSpeedY = getBallSpeed() ; // Random direction

    leftPaddle.style.top = '160px';
    rightPaddle.style.top = '160px';

    gameStarted = true;
    update();
    
    
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = 'Continue';
    } else {
        pauseButton.textContent = 'Pause';
        // Resume the game loop if it was paused
        if (gameStarted) {
            update();
        }
    }
}

function update() {
    // Check if the game has started
    if (!gameStarted) {
        requestAnimationFrame(update);
        return;
    }

    // Update paddles
    leftPaddle.style.top = Math.min(320, Math.max(0, parseInt(leftPaddle.style.top) + leftPaddleSpeed)) + 'px';

    // Update right paddle position (computer-controlled)
    const paddleCenter = parseInt(rightPaddle.style.top) + 40;
    if (paddleCenter < ballY - 5) {
        rightPaddleSpeed = getBallSpeed();
    } else if (paddleCenter > ballY + 5) {
        rightPaddleSpeed = -getBallSpeed();
    } else {
        rightPaddleSpeed = 0;
    }
    rightPaddle.style.top = Math.min(320, Math.max(0, parseInt(rightPaddle.style.top) + rightPaddleSpeed)) + 'px';

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check collisions with walls
    if (ballY <= 0 || ballY >= 385) {
        ballSpeedY = -ballSpeedY;
    }

    // Check collisions with paddles
    if (
        (ballX <= 20 && ballX >= 10 && ballY + 15 >= parseInt(leftPaddle.style.top) && ballY <= parseInt(leftPaddle.style.top) + 80) ||
        (ballX >= 570 && ballX <= 580 && ballY + 15 >= parseInt(rightPaddle.style.top) && ballY <= parseInt(rightPaddle.style.top) + 80)
    ) {
        ballSpeedX = -ballSpeedX;

        // Adjust ball angle based on where it hits the paddle
        const relativeIntersectY = (ballY + 7.5) - (parseInt(leftPaddle.style.top) + 40);
        const normalizedRelativeIntersectY = relativeIntersectY / 40; // 40 is half of the paddle height
        const bounceAngle = normalizedRelativeIntersectY * (Math.PI / 4); // Max bounce angle is 45 degrees
        ballSpeedY = getBallSpeed() * Math.sin(bounceAngle);

        // Ensure the ball always moves in the direction it hit the paddle
        if (ballSpeedX < 0 && ballX < 290) {
            ballSpeedX = Math.abs(ballSpeedX);
        } else if (ballSpeedX > 0 && ballX > 290) {
            ballSpeedX = -Math.abs(ballSpeedX);
        }
    }

    // Check if the ball passed the paddles
    if (ballX <= 0) {
        // Right player scores
        rightScore++;
        updateScoreDisplay();
        resetBall();
    } else if (ballX >= 590) {
        // Left player scores
        leftScore++;
        updateScoreDisplay();
        resetBall();
    }

    // Update ball position in the DOM
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Call update function recursively
    requestAnimationFrame(update);
}

function resetBall() {
    // Reset ball position and speed
    ballX = 300;
    ballY = 200;
    ballSpeedX = getBallSpeed() * (Math.random() < 0.5 ? 1 : -1); // Random direction
    ballSpeedY = getBallSpeed() * (Math.random() < 0.5 ? 1 : -1); // Random direction
}




function getBallSpeed() {
    // Get the difficulty level directly and return the corresponding speed
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            return Math.abs(4);
        case 'medium':
            return Math.abs(6);
        case 'hard':
            return Math.abs(8);
        default:
            return Math.abs(4);
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `${leftScore} - ${rightScore}`;
}

document.addEventListener('keydown', function (event) {
    // Player controls
    switch (event.key) {
        case 'ArrowUp':
            leftPaddleSpeed = -5;
            break;
        case 'ArrowDown':
            leftPaddleSpeed = 5;
            break;
    }
});

document.addEventListener('keyup', function (event) {
    // Stop paddle movement on key release
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        leftPaddleSpeed = 0;
    }
});
function resetGame() {
    leftScore = 0;
    rightScore = 0;
    updateScoreDisplay();

    ballX = 300;
    ballY = 200;

    // Set ball speed based on the selected difficulty
    const speedMultiplier = getDifficultyMultiplier();
    ballSpeedX = Math.abs(4) * speedMultiplier;
    ballSpeedY = Math.abs(4) * speedMultiplier;

    leftPaddle.style.top = '160px';
    rightPaddle.style.top = '160px';

    gameStarted = true;
    resetBall();
}

startButton.addEventListener('click', function(){
    if(gameStarted){
        resetGame()
    }
    startGame()
});

restarttButton.addEventListener('click', function(){
        location.reload();
});