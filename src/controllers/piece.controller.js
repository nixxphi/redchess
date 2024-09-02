// ./controllers/piece.controller.js

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

// Validates if a move is possible without leaving the king in check
export function validateMove(piece, newPosition, board, currentTurn) {
  const possibleMoves = piece.generatePossibleMoves(board);

  if (!possibleMoves.includes(newPosition)) {
    return false;
  }

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

  const oldPosition = piece.position;

  // Handle capturing of opponent's piece
  if (board[newPosition]) {
    board[newPosition].capture();
  }

  // Handle special moves (castling, en passant, promotion)
  specialMoveHandler(piece, newPosition, board);

  // Update board state
  piece.move(newPosition);
  board[newPosition] = piece;
  delete board[oldPosition];
}

// Special move handler (castling, en passant, promotion)
export function specialMoveHandler(piece, newPosition, board) {
  // Castling logic
  if (piece.type === 'king' && !piece.hasMoved) {
    const row = piece.color === 'white' ? '1' : '8';
    if (newPosition === `g${row}` || newPosition === `c${row}`) {
      const rookPosition = newPosition === `g${row}` ? `h${row}` : `a${row}`;
      const rookDestination = newPosition === `g${row}` ? `f${row}` : `d${row}`;
      const rook = board[rookPosition];
      
      if (rook && rook.type === 'rook' && !rook.hasMoved) {
        board[rookDestination] = rook;
        delete board[rookPosition];
        rook.move(rookDestination);
      }
    }
  }

  // En passant logic
  if (piece.type === 'pawn') {
    const direction = piece.color === 'white' ? 1 : -1;
    const enPassantRow = piece.color === 'white' ? '5' : '4';
    if (piece.position[1] === enPassantRow && newPosition[0] !== piece.position[0]) {
      const capturedPawnPosition = `${newPosition[0]}${parseInt(newPosition[1]) - direction}`;
      const capturedPawn = board[capturedPawnPosition];
      if (capturedPawn && capturedPawn.type === 'pawn' && capturedPawn.color !== piece.color && capturedPawn.hasMoved) {
        capturedPawn.capture();
        delete board[capturedPawnPosition];
      }
    }
  }

  // Pawn promotion logic
  if (piece.type === 'pawn') {
    const promotionRow = piece.color === 'white' ? '8' : '1';
    if (newPosition[1] === promotionRow) {
      // Promote to a queen by default
      const promotedPiece = new Queen(piece.color, newPosition);
      board[newPosition] = promotedPiece;
    }
  }
}

// Generates possible moves for a piece and validates based on the current board state
export function generateValidMoves(piece, board) {
  const possibleMoves = piece.generatePossibleMoves(board);
  return possibleMoves.filter(move => validateMove(piece, move, board, piece.color));
}

// Reset piece position in case of undo
export function resetPiecePosition(piece, oldPosition, board) {
  piece.position = oldPosition;
  board[oldPosition] = piece;
}
 