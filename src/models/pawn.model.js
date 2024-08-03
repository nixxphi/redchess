// ./models/pawn.model.js

import Piece from './piece.model.js';

export default class Pawn extends Piece {
  constructor(color, position) {
    super('pawn', color, position, color === 'white' ? '♙' : '♟');
  }

  generatePossibleMoves(board) {
    const moves = [];
    const direction = this.color === 'white' ? 1 : -1; // White pawns move up, black pawns move down
    const [file, rank] = this.position.split('');
    const currentRank = parseInt(rank);

    // Standard move
    const forwardMove = `${file}${currentRank + direction}`;
    if (!board[forwardMove]) {
      moves.push(forwardMove);
      // Initial double move
      if (!this.hasMoved) {
        const doubleMove = `${file}${currentRank + 2 * direction}`;
        if (!board[doubleMove]) {
          moves.push(doubleMove);
        }
      }
    }

    // Captures
    const captureLeft = `${String.fromCharCode(file.charCodeAt(0) - 1)}${currentRank + direction}`;
    const captureRight = `${String.fromCharCode(file.charCodeAt(0) + 1)}${currentRank + direction}`;
    if (board[captureLeft] && board[captureLeft].color !== this.color) {
      moves.push(captureLeft);
    }
    if (board[captureRight] && board[captureRight].color !== this.color) {
      moves.push(captureRight);
    }

    return moves;
  }
}
