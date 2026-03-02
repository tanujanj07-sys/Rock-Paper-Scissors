let mode = '';
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let score1 = 0;
let score2 = 0;
let playerTurn = 1;
let player1Move = '';
let player2Move = '';
let timerInterval;
let turnTimerInterval;
let gameTimer = 120;
let turnTimer = 5;
let gameActive = true;

function setMode(selectedMode) {
    mode = selectedMode;
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('player-setup').style.display = 'block';
    
    const player2Input = document.getElementById('player2');
    if (mode === 'player') {
        player2Input.style.display = 'block';
        player2Input.placeholder = 'Enter Player 2 Name';
    } else {
        player2Input.style.display = 'none';
        player2Input.placeholder = 'Computer';
    }
}

function startGame() {
    player1Name = document.getElementById('player1').value.trim() || 'Player 1';
    player2Name = mode === 'player' ? 
        (document.getElementById('player2').value.trim() || 'Player 2') : 'Computer';

    // Update ALL player name displays
    document.getElementById('player1Name').textContent = player1Name;
    document.getElementById('player2Name').textContent = player2Name;
    document.getElementById('player1NameScore').textContent = player1Name;
    document.getElementById('player2NameScore').textContent = player2Name;
    
    document.getElementById('player2ScoreContainer').style.display = 'block';

    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    resetGameState();
    document.getElementById('currentPlayer').textContent = player1Name;
}

function playerMove(choice) {
    if (!gameActive) return;
    
    // BLOCK MOVES IF BOTH PLAYERS HAVE CHOSEN
    if (player1Move && player2Move) return;
    
    playMoveAnimation(choice);

    if (mode === 'computer') {
        // COMPUTER MODE
        player1Move = choice;
        setTimeout(() => computerMove(), 900);
    } else {
        // PLAYER VS PLAYER MODE - FIXED LOGIC
        if (playerTurn === 1 && !player1Move) {
            // Player 1's turn
            player1Move = choice;
            document.getElementById('player1-choice').textContent = getEmoji(choice);
            document.getElementById('currentPlayer').textContent = player2Name;
            playerTurn = 2;
            document.getElementById('result').textContent = `${player2Name}, your turn!`;
            
        } else if (playerTurn === 2 && !player2Move) {
            // Player 2's turn - THIS WAS BROKEN
            player2Move = choice;
            document.getElementById('player2-choice').textContent = getEmoji(choice);
            checkWinner();
        }
    }
}

function playMoveAnimation(choice) {
    const currentPlayerElement = playerTurn === 1 ? 
        document.getElementById('player1-choice') : 
        document.getElementById('player2-choice');
    
    currentPlayerElement.textContent = getEmoji(choice);
    currentPlayerElement.classList.add('animate');
    setTimeout(() => currentPlayerElement.classList.remove('animate'), 600);
}

function computerMove() {
    player2Move = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    document.getElementById('player2-choice').textContent = getEmoji(player2Move);
    document.getElementById('player2-choice').classList.add('animate');
    setTimeout(() => document.getElementById('player2-choice').classList.remove('animate'), 600);
    checkWinner();
}

function checkWinner() {
    let result = document.getElementById('result');
    
    if (player1Move === player2Move) {
        result.textContent = "It's a Tie! 🎭";
    } else if (
        (player1Move === 'rock' && player2Move === 'scissors') ||
        (player1Move === 'paper' && player2Move === 'rock') ||
        (player1Move === 'scissors' && player2Move === 'paper')
    ) {
        result.textContent = `${player1Name} wins! 🎉`;
        score1++;
    } else {
        result.textContent = `${player2Name} wins! 🎉`;
        score2++;
    }
    
    updateScore();
    setTimeout(resetTurn, 2000); // Show result for 2 seconds
}

function resetTurn() {
    player1Move = '';
    player2Move = '';
    document.getElementById('player1-choice').textContent = '❓';
    document.getElementById('player2-choice').textContent = '❓';
    playerTurn = 1;
    document.getElementById('currentPlayer').textContent = player1Name;
    document.getElementById('result').textContent = 'Make your move! 🎮';
    resetTurnTimer();
}

function resetGameState() {
    score1 = 0;
    score2 = 0;
    gameTimer = 120;
    turnTimer = 5;
    gameActive = true;
    playerTurn = 1;
    player1Move = '';
    player2Move = '';
    
    if (timerInterval) clearInterval(timerInterval);
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    
    updateScore();
    document.getElementById('turnTimer').textContent = turnTimer;
    document.getElementById('gameTimer').textContent = '2:00';
    document.getElementById('result').textContent = 'Make your move! 🎮';
    document.getElementById('winnerMessage').style.display = 'none';
    
    startGameTimer();
    resetTurnTimer();
}

function updateScore() {
    document.getElementById('player1Score').textContent = score1;
    document.getElementById('player2Score').textContent = score2;
    document.getElementById('player1ScoreBoard').textContent = score1;
    document.getElementById('player2ScoreBoard').textContent = score2;
}

function startGameTimer() {
    timerInterval = setInterval(() => {
        gameTimer--;
        const minutes = Math.floor(gameTimer / 60);
        const seconds = gameTimer % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (gameTimer <= 0) endGame();
    }, 1000);
}

function startTurnTimer() {
    turnTimerInterval = setInterval(() => {
        turnTimer--;
        document.getElementById('turnTimer').textContent = turnTimer;
        
        if (turnTimer <= 0) {
            if (mode === 'player' && playerTurn === 2 && !player2Move) {
                // Player 2 didn't move - give turn back to Player 1
                document.getElementById('result').textContent = "Player 2 timed out! Player 1's turn.";
                playerTurn = 1;
                document.getElementById('currentPlayer').textContent = player1Name;
            }
            setTimeout(resetTurn, 1000);
        }
    }, 1000);
}

function resetTurnTimer() {
    if (turnTimerInterval) clearInterval(turnTimerInterval);
    turnTimer = 5;
    document.getElementById('turnTimer').textContent = turnTimer;
    startTurnTimer();
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(turnTimerInterval);
    
    let message = '';
    if (score1 > score2) {
        message = `${player1Name} wins the game! 🏆`;
    } else if (score2 > score1) {
        message = `${player2Name} wins the game! 🏆`;
    } else {
        message = "It's a Tie Game! 🤝";
    }
    
    document.getElementById('winnerMessage').textContent = message;
    document.getElementById('winnerMessage').style.display = 'block';
}

function resetGame() {
    if (confirm('Reset the entire game?')) location.reload();
}

function backToModeSelection() {
    if (confirm('Return to main menu?')) location.reload();
}

function getEmoji(move) {
    const emojis = { rock: '🪨', paper: '📜', scissors: '✂️' };
    return emojis[move] || '❓';
}
