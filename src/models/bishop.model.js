import Piece from './piece.model.js';

export default class Bishop extends Piece {
  constructor(color, position) {
    super('bishop', color, position, color === 'white' ? '♗' : '♝');
  }

  generatePossibleMoves(board) {
    const moves = [];
    // Implement bishop-specific move logic here
    return moves;
  }
}
