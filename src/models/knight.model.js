
import Piece from './piece.model.js';

export default class Knight extends Piece {
  constructor(color, position) {
    super('knight', color, position, color === 'white' ? '♘' : '♞');
  }

  generatePossibleMoves(board) {
    const moves = [];
    // Implement knight-specific move logic here
    return moves;
  }
}
