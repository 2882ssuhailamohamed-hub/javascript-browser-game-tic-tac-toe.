/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

/*---------------------------- Variables (state) ----------------------------*/
let board;
let turn;
let winner;
let tie;

/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const resetBtnEl = document.querySelector('#reset');
const player1El = document.querySelector('.player-1');
const player2El = document.querySelector('.player-2');

/*-------------------------------- Functions --------------------------------*/

// Initialize the game state
function init() {
  board = ['', '', '', '', '', '', '', '', ''];
  turn = '🌺'; // Flowers start
  winner = false;
  tie = false;
  
  // Update player indicators
  updatePlayerIndicators();
  
  render();
}

// Update active player visual indicator
function updatePlayerIndicators() {
  if (turn === '🌺') {
    player1El.classList.add('active');
    player2El.classList.remove('active');
  } else {
    player2El.classList.add('active');
    player1El.classList.remove('active');
  }
}

// Render game state to the DOM
function render() {
  updateBoard();
  updateMessage();
}

// Update the board display
function updateBoard() {
  board.forEach((cell, index) => {
    const square = squareEls[index];
    
    // Clear previous content and animations
    square.textContent = '';
    square.classList.remove('celebrate', 'sparkle');
    square.removeAttribute('data-value');
    
    if (cell !== '') {
      square.textContent = cell;
      square.setAttribute('data-value', cell);
      
      // Add different animations based on symbol
      if (cell === '🌺') {
        square.classList.add('celebrate');
      } else {
        square.classList.add('sparkle');
      }
    }
  });
}

// Update the message display
function updateMessage() {
  if (!winner && !tie) {
    const playerName = turn === '🌺' ? 'Flowers' : 'Sparkles';
    messageEl.textContent = `It's ${playerName}'s turn!`;
    messageEl.style.color = 'var(--purple-secondary)';
  } else if (!winner && tie) {
    messageEl.textContent = "🌸 It's a magical tie! 🌸";
    messageEl.style.color = 'var(--pink-accent)';
  } else {
    const winnerName = turn === '🌺' ? 'Flowers' : 'Sparkles';
    messageEl.textContent = `🎉 ${winnerName} win! The garden celebrates! 🎉`;
    messageEl.style.color = 'var(--purple-dark)';
  }
  
  updatePlayerIndicators();
}

// Handle player clicks on squares
function handleClick(event) {
  // Get the index of the clicked square
  const squareIndex = parseInt(event.target.id);
  
  // If square is already taken or game is over, return early
  if (board[squareIndex] !== '' || winner) {
    return;
  }
  
  // Place the piece
  placePiece(squareIndex);
  
  // Check for winner
  checkForWinner();
  
  // Check for tie
  checkForTie();
  
  // Switch turns if game is still ongoing
  if (!winner && !tie) {
    switchPlayerTurn();
  }
  
  // Render updated state
  render();
}

// Place a piece on the board
function placePiece(index) {
  board[index] = turn;
}

// Check if there's a winner
function checkForWinner() {
  winningCombos.forEach(combo => {
    const [a, b, c] = combo;
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      winner = true;
      
      // Highlight winning squares
      combo.forEach(index => {
        squareEls[index].style.background = 'linear-gradient(135deg, var(--purple-light), var(--lavender))';
        squareEls[index].style.border = '2px solid var(--pink-accent)';
      });
    }
  });
}

// Check if the game is a tie
function checkForTie() {
  if (winner) return;
  
  // If no empty squares and no winner, it's a tie
  tie = !board.includes('');
}

// Switch to the other player's turn
function switchPlayerTurn() {
  turn = turn === '🌺' ? '✨' : '🌺';
  updatePlayerIndicators();
}

/*----------------------------- Event Listeners -----------------------------*/

// Add event listeners to squares
squareEls.forEach(square => {
  square.addEventListener('click', handleClick);
});

// Add event listener to reset button
resetBtnEl.addEventListener('click', () => {
  // Reset square styles
  squareEls.forEach(square => {
    square.style.background = 'var(--white)';
    square.style.border = 'none';
  });
  init();
});

// Initialize the game when the page loads
init();