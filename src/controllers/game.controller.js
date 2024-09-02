
import { movePiece } from './piece.controller.js';

let board = {}; // Initialize with the starting board state
let currentTurn = 'white';

function isCheck(color, board) {
  return leavesKingInCheck(board, color);
}

function isCheckmate(color, board) {
  if (!isCheck(color, board)) return false;

  // Iterate through all pieces of the given color to see if any valid move exists
  for (let position in board) {
    const piece = board[position];
    if (piece && piece.color === color) {
      const possibleMoves = piece.generatePossibleMoves(board);
      for (let move of possibleMoves) {
        const simulatedBoard = { ...board };
        simulatedBoard[move] = piece;
        simulatedBoard[position] = null;

        if (!leavesKingInCheck(simulatedBoard, color)) {
          return false;
        }
      }
    }
  }
  return true;
}

function isStalemate(color, board) {
  if (isCheck(color, board)) return false;

  for (let position in board) {
    const piece = board[position];
    if (piece && piece.color === color) {
      const possibleMoves = piece.generatePossibleMoves(board);
      for (let move of possibleMoves) {
        const simulatedBoard = { ...board };
        simulatedBoard[move] = piece;
        simulatedBoard[position] = null;

        if (!leavesKingInCheck(simulatedBoard, color)) {
          return false;
        }
      }
    }
  }
  return true;
}

export function makeMove(piece, newPosition) {
  if (piece.color !== currentTurn) {
    throw new Error('Not your turn');
  }

  movePiece(piece, newPosition, board, currentTurn);

  if (isCheck(currentTurn, board)) {
    throw new Error('Move places king in check');
  }

  if (isCheckmate(currentTurn, board)) {
    console.log('Checkmate! ' + (currentTurn === 'white' ? 'Black' : 'White') + ' wins!');
    // Handle game over logic
    endGame(currentTurn === 'white' ? 'black' : 'white');
  } else if (isStalemate(currentTurn, board)) {
    console.log('Stalemate! It’s a draw.');
    // Handle draw logic
    endGame('draw');
  } else {
    // Switch turns
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
  }
}

export function initializeGame() {
  // Initialize board and pieces here, setting up the game state
  board = setupInitialBoard();
  currentTurn = 'white';
}

function endGame(winner) {
  // Handle game end, declare winner or draw
  console.log(`Game over. Winner: ${winner}`);
  // Reset the game state or allow for a new game
}

function setupInitialBoard() {
  // Set up the initial board with pieces in starting positions
  const initialBoard = {};

  // Add pawns
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + i);
    initialBoard[`${file}2`] = new Pawn('white', `${file}2`);
    initialBoard[`${file}7`] = new Pawn('black', `${file}7`);
  }

  // Add other pieces
  const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + i);
    initialBoard[`${file}1`] = new pieceClasses[backRank[i]]('white', `${file}1`);
    initialBoard[`${file}8`] = new pieceClasses[backRank[i]]('black', `${file}8`);
  }

  return initialBoard;
}
