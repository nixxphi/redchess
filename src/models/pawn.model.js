import Piece from './piece.model.js';

export default class Pawn extends Piece {
  constructor(color, position) {
    super('pawn', color, position, color === 'white' ? '♙' : '♟');
  }

  generatePossibleMoves(board) {
    const moves = [];
    // Implement pawn-specific move logic here
    return moves;
  }
}
