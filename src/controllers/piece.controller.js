git // ./controllers/piece.controller.js

import Pawn from '../models/pawn.model.js';
import Knight from '../models/knight.model.js';
import Bishop from '../models/bishop.model.js';
import Rook from '../models/rook.model.js';
import Queen from '../models/queen.model.js';
import King from '../models/king.model.js';

const pieceClasses = {
  pawn: Pawn,
  knight: Knight,
  bishop: Bishop,
  rook: Rook,
  queen: Queen,
  king: King,
};

// Validates if a move is possible, not leaving the king in check
export function validateMove(piece, newPosition, board, currentTurn) {
  const possibleMoves = piece.generatePossibleMoves(board);

  // Check if the new position is among possible moves
  if (!possibleMoves.includes(newPosition)) {
    return false;
  }

  // Simulate the move to see if it leaves the king in check
  const simulatedBoard = { ...board };
  const oldPosition = piece.position;
  simulatedBoard[newPosition] = piece;
  simulatedBoard[oldPosition] = null;

  if (leavesKingInCheck(simulatedBoard, piece.color)) {
    return false;
  }

  return true;
}

// Checks if moving the piece will leave the king in check
function leavesKingInCheck(board, color) {
  const kingPosition = findKingPosition(board, color);
  const opponentColor = color === 'white' ? 'black' : 'white';

  // Check all opponent pieces to see if they can attack the king's position
  for (let position in board) {
    const piece = board[position];
    if (piece && piece.color === opponentColor) {
      const opponentMoves = piece.generatePossibleMoves(board);
      if (opponentMoves.includes(kingPosition)) {
        return true;
      }
    }
  }
  return false;
}

// Finds the position of the king for a given color
function findKingPosition(board, color) {
  for (let position in board) {
    const piece = board[position];
    if (piece && piece.type === 'king' && piece.color === color) {
      return position;
    }
  }
  throw new Error('King not found');
}

// Moves the piece after validation
export function movePiece(piece, newPosition, board, currentTurn) {
  if (!validateMove(piece, newPosition, board, currentTurn)) {
    throw new Error('Invalid move');
  }

  piece.move(newPosition);

  // Handle capturing of opponent's piece
  if (board[newPosition]) {
    board[newPosition].capture();
  }

  // Update board state
  board[newPosition] = piece;
  delete board[piece.position];
}
