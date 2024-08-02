import Piece from './piece.model.js';

export default class Rook extends Piece {
  constructor(color, position) {
    super('rook', color, position, color === 'white' ? '♖' : '♜');
  }

  generatePossibleMoves(board) {
    const moves = [];
    // Implement rook-specific move logic here
    return moves;
  }
}
