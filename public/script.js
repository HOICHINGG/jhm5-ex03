const cells = document.querySelectorAll('.cell');
const winnerMessage = document.getElementById('winnerMessage');
const restartButton = document.getElementById('restartButton');

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Handle cell click
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (board[index] === "") {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// Check if there's a winner
function checkWinner() {
  let winner = null;
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
    }
  }

  if (winner) {
    winnerMessage.textContent = `Player ${winner} Wins!`;
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
  } else if (!board.includes("")) {
    winnerMessage.textContent = "It's a Tie!";
  }
}

// Restart the game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('taken');
    cell.addEventListener('click', handleCellClick);
  });
  winnerMessage.textContent = "";
}

// Add event listeners to cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Add event listener to the restart button
restartButton.addEventListener('click', restartGame);