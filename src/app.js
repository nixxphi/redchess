// ./app.js

import Game from './controllers/game.controller.js';
import VSPC from './controllers/vspc.controller.js';
import ChessboardView from './views/board.view.js';
import GameControls from './views/controls.view.js';
import PieceView from './views/piece.view.js';

const game = new Game();
const vspc = new VSPC();
const boardElement = document.getElementById('chessboard');
const chessboardView = new ChessboardView(boardElement, game);
const gameControls = new GameControls(game);

// Set the difficulty level (easy, medium, hard)
const difficultyLevel = 'medium';

// Set the difficulty level options
const difficultyOptions = {
  easy: {
    depth: 1,
    randomize: true,
  },
  medium: {
    depth: 2,
    randomize: false,
  },
  hard: {
    depth: 3,
    randomize: false,
  },
};

// Set the difficulty level
vspc.setDifficulty(difficultyLevel, difficultyOptions[difficultyLevel]);

// Initialize the game
game.initializeGame();

// Start the game loop
function gameLoop() {
  // Get the current game state
  const currentState = game.getGameState();

  // Generate a move for the computer player
  const move = vspc.generateMove(currentState.board, currentState.currentTurn);

  // Make the move
  game.makeMove(move);

  // Update the board view
  chessboardView.updateBoard(game.board);

  // Check for game over
  if (game.isGameOver()) {
    console.log(`Game over! Winner: ${game.getWinner()}`);
  } else {
    // Continue the game loop
    setTimeout(gameLoop, 1000); // Adjust the delay as needed
  }
}

// Start the game loop
gameLoop();