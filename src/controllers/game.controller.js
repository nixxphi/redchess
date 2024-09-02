// ./controllers/game.controller.js

import { movePiece } from './piece.controller.js';
import { Pawn, Rook, Knight, Bishop, Queen, King } from '../models/pieceClasses.js';

export default class GameController {
  constructor() {
    this.board = {}; // Initialize with the starting board state
    this.currentTurn = 'white';
    this.moveHistory = []; // Stack to keep track of moves for undo/redo
    this.redoStack = []; // Stack to keep track of undone moves for redo functionality
    this.initializeGame();
  }

  initializeGame() {
    this.board = this.setupInitialBoard();
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.redoStack = [];
  }

  setupInitialBoard() {
    const initialBoard = {};

    // Adding pieces
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + i);
      initialBoard[`${file}2`] = new Pawn('white', `${file}2`);
      initialBoard[`${file}7`] = new Pawn('black', `${file}7`);
    }
    const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    const pieceClasses = { rook: Rook, knight: Knight, bishop: Bishop, queen: Queen, king: King };

    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + i);
      initialBoard[`${file}1`] = new pieceClasses[backRank[i]]('white', `${file}1`);
      initialBoard[`${file}8`] = new pieceClasses[backRank[i]]('black', `${file}8`);
    }

    return initialBoard;
  }

  makeMove(piece, newPosition) {
    if (piece.color !== this.currentTurn) {
      throw new Error('Not your turn');
    }

    const previousState = JSON.parse(JSON.stringify(this.board));

    movePiece(piece, newPosition, this.board, this.currentTurn);

    if (this.isCheck(this.currentTurn)) {
      // Revert the move if it places the king in check
      this.board = previousState;
      throw new Error('Move places king in check');
    }

    this.moveHistory.push(previousState); // Save the current state before making the move
    this.redoStack = []; // Clear the redo stack as a new move invalidates redo history

    if (this.isCheckmate(this.currentTurn)) {
      console.log(`Checkmate! ${(this.currentTurn === 'white' ? 'Black' : 'White')} wins!`);
      this.endGame(this.currentTurn === 'white' ? 'black' : 'white');
    } else if (this.isStalemate(this.currentTurn)) {
      console.log('Stalemate! It’s a draw.');
      this.endGame('draw');
    } else {
      this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    }
  }

  undoMove() {
    if (this.moveHistory.length === 0) {
      throw new Error('No moves to undo');
    }

    const previousState = this.moveHistory.pop();
    const currentState = JSON.parse(JSON.stringify(this.board));
    this.board = previousState;
    this.redoStack.push(currentState); // Save the current state for redo functionality
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
  }

  redoMove() {
    if (this.redoStack.length === 0) {
      throw new Error('No moves to redo');
    }

    const nextState = this.redoStack.pop();
    this.moveHistory.push(JSON.parse(JSON.stringify(this.board))); // Save the current state before redoing the move
    this.board = nextState;
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
  }

  isCheck(color) {
    return this.leavesKingInCheck(this.board, color);
  }

  isCheckmate(color) {
    if (!this.isCheck(color)) return false;

    for (let position in this.board) {
      const piece = this.board[position];
      if (piece && piece.color === color) {
        const possibleMoves = piece.generatePossibleMoves(this.board);
        for (let move of possibleMoves) {
          const simulatedBoard = { ...this.board };
          simulatedBoard[move] = piece;
          simulatedBoard[position] = null;

          if (!this.leavesKingInCheck(simulatedBoard, color)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  isStalemate(color) {
    if (this.isCheck(color)) return false;

    for (let position in this.board) {
      const piece = this.board[position];
      if (piece && piece.color === color) {
        const possibleMoves = piece.generatePossibleMoves(this.board);
        for (let move of possibleMoves) {
          const simulatedBoard = { ...this.board };
          simulatedBoard[move] = piece;
          simulatedBoard[position] = null;

          if (!this.leavesKingInCheck(simulatedBoard, color)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  endGame(winner) {
    console.log(`Game over. Winner: ${winner}`);
    this.initializeGame(); // Reset the game state for a new game
  }

  leavesKingInCheck(board, color) {
    const kingPosition = Object.keys(board).find(
      (position) => board[position] && board[position].type === 'king' && board[position].color === color
    );

    for (let position in board) {
      const piece = board[position];
      if (piece && piece.color !== color) {
        const attackedSquares = piece.generatePossibleMoves(board);
        if (attackedSquares.includes(kingPosition)) {
          return true;
        }
      }
    }
    return false;
  }

  // Example usage of undoMove within the game flow
  handleUndoAction() {
    try {
      this.undoMove();
      console.log('Move undone');
    } catch (error) {
      console.error(error.message);
    }
  }

  // Example usage of redoMove within the game flow
  handleRedoAction() {
    try {
      this.redoMove();
      console.log('Move redone');
    } catch (error) {
      console.error(error.message);
    }
  }
}
