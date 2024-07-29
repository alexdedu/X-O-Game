// Selecting elements
const score0El = document.getElementById("score--0");
const score1El = document.getElementById("score--1");
const btnRestart = document.getElementById("restartGame");
const cells = document.querySelectorAll(".cell");
const btnSelectX = document.getElementById("selectX");
const btnSelectO = document.getElementById("selectO");
const btnDifficultyNewbie = document.getElementById("difficultyNewbie");
const btnDifficultyMedium = document.getElementById("difficultyMedium");
const btnDifficultyExpert = document.getElementById("difficultyExpert");

// Starting conditions
let scores,
  activePlayer,
  board,
  gameActive,
  playerSelected,
  playerSymbol,
  aiSymbol,
  difficulty,
  playerTurn;

// Initialize the game function
const initGame = () => {
  scores = [0, 0];
  activePlayer = null;
  board = Array(3)
    .fill()
    .map(() => Array(3).fill(""));
  gameActive = true;
  playerSelected = false;
  difficulty = 1; // Default difficulty
  playerTurn = true;

  // Reset the score and cells
  score0El.textContent = "-";
  score1El.textContent = "-";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("disabled");
  });

  // Remove red bottom border from active player
  document.getElementById("player1").style.borderBottom = "none";
  document.getElementById("player2").style.borderBottom = "none";

  // Reset the text
  document.getElementById("start_select").textContent = "Select a player";
};

initGame();

// Choose a player (X or O)
btnSelectX.addEventListener("click", function () {
  playerSymbol = "X";
  aiSymbol = "O";
  activePlayer = playerSymbol;
  document.getElementById("start_select").textContent = "Playing as X";
  document.getElementById("player1").style.borderBottom = "2px solid red";
  document.getElementById("player2").style.borderBottom = "none";
  playerSelected = true;
});

btnSelectO.addEventListener("click", function () {
  playerSymbol = "O";
  aiSymbol = "X";
  activePlayer = playerSymbol;
  document.getElementById("start_select").textContent = "Playing as O";
  document.getElementById("player2").style.borderBottom = "2px solid red";
  document.getElementById("player1").style.borderBottom = "none";
  playerSelected = true;
});

// Select difficulty from dropdown
document
  .getElementById("difficultyNewbie")
  .addEventListener("click", function () {
    difficulty = 0.5; // Newbie difficulty
    document.getElementById("start_select").textContent = "Difficulty: Newbie";
  });

document
  .getElementById("difficultyMedium")
  .addEventListener("click", function () {
    difficulty = 0.75; // Medium difficulty
    document.getElementById("start_select").textContent = "Difficulty: Medium";
  });

document
  .getElementById("difficultyExpert")
  .addEventListener("click", function () {
    difficulty = 0.95; // Expert difficulty
    document.getElementById("start_select").textContent = "Difficulty: Expert";
  });

// Click on cell
cells.forEach((cell, index) => {
  cell.addEventListener("click", function () {
    if (gameActive && playerSelected && this.textContent === "" && playerTurn) {
      playerMove(index);
    }
  });
});

// Reset Board
const resetBoard = () => {
  board = Array(3)
    .fill()
    .map(() => Array(3).fill(""));
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("disabled");
  });
  gameActive = true;
  playerTurn = true;
  activePlayer = playerSymbol;
  document.getElementById("start_select").textContent =
    "Playing as " + activePlayer;
  document.getElementById("player1").style.borderBottom =
    activePlayer === "X" ? "2px solid red" : "none";
  document.getElementById("player2").style.borderBottom =
    activePlayer === "O" ? "2px solid red" : "none";
};

// Check Winner Function
const checkWinner = function () {
  return checkWin(board, playerSymbol) || checkWin(board, aiSymbol);
};

// Function to check win
const checkWin = (board, symbol) => {
  // Horizontal check
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === symbol &&
      board[i][1] === symbol &&
      board[i][2] === symbol
    ) {
      return true;
    }
  }

  // Vertical check
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === symbol &&
      board[1][j] === symbol &&
      board[2][j] === symbol
    ) {
      return true;
    }
  }

  // Diagonal checks
  if (
    board[0][0] === symbol &&
    board[1][1] === symbol &&
    board[2][2] === symbol
  ) {
    return true;
  }

  if (
    board[0][2] === symbol &&
    board[1][1] === symbol &&
    board[2][0] === symbol
  ) {
    return true;
  }

  return false;
};

// Check Draw Function
const isDraw = function () {
  return board.flat().every((cell) => cell !== "");
};

// Update Scores
const updateScores = () => {
  if (activePlayer === playerSymbol) {
    scores[0]++;
    score0El.textContent = scores[0];
  } else {
    scores[1]++;
    score1El.textContent = scores[1];
  }
};

// Make move function
const makeMove = (index, symbol) => {
  board[Math.floor(index / 3)][index % 3] = symbol;
  cells[index].textContent = symbol;
  cells[index].classList.add("disabled");

  // Update the UI to indicate the current player's turn
  document.getElementById("player1").style.borderBottom =
    activePlayer === "X" ? "2px solid red" : "none";
  document.getElementById("player2").style.borderBottom =
    activePlayer === "O" ? "2px solid red" : "none";
};

// Player move function
const playerMove = (index) => {
  if (board[Math.floor(index / 3)][index % 3] === "") {
    makeMove(index, playerSymbol);

    if (checkWinner()) {
      updateScores();
      gameActive = false;
      setTimeout(resetBoard, 1000);
    } else if (isDraw()) {
      gameActive = false;
      setTimeout(resetBoard, 1000);
      document.getElementById("start_select").textContent = "Draw!";
    } else {
      playerTurn = false;
      activePlayer = aiSymbol;
      setTimeout(aiMove, 500);
    }
  }
};

// AI move function using Minimax algorithm
const aiMove = () => {
  if (gameActive) {
    const bestMove = minimax(board, aiSymbol).index;
    makeMove(bestMove, aiSymbol);

    if (checkWinner()) {
      updateScores();
      gameActive = false;
      setTimeout(resetBoard, 1000);
    } else if (isDraw()) {
      gameActive = false;
      setTimeout(resetBoard, 1000);
      document.getElementById("start_select").textContent = "Draw!";
    } else {
      playerTurn = true;
      activePlayer = playerSymbol;
      document.getElementById("start_select").textContent =
        "Playing as " + playerSymbol;
      document.getElementById("player1").style.borderBottom =
        playerSymbol === "X" ? "2px solid red" : "none";
      document.getElementById("player2").style.borderBottom =
        playerSymbol === "O" ? "2px solid red" : "none";
    }
  }
};

// Random difficulty
const shouldMakeSuboptimalMove = () => {
  return Math.random() > difficulty;
};

// Minimax algorithm
const minimax = (newBoard, player, currentDepth = 0) => {
  const availSpots = newBoard.flat().reduce((acc, cell, idx) => {
    if (cell === "") acc.push(idx);
    return acc;
  }, []);

  if (checkWin(newBoard, playerSymbol)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiSymbol)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[Math.floor(move.index / 3)][move.index % 3] = player;

    const result = minimax(
      newBoard,
      player === aiSymbol ? playerSymbol : aiSymbol,
      currentDepth + 1
    );

    newBoard[Math.floor(move.index / 3)][move.index % 3] = "";
    move.score = result.score;

    moves.push(move);
  }

  let bestMove;
  if (player === aiSymbol) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }

    // Introduce randomness difficulty
    if (shouldMakeSuboptimalMove() && moves.length > 1) {
      bestMove = Math.floor(Math.random() * moves.length);
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

// New game(Restart)
btnRestart.addEventListener("click", initGame);
