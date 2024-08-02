
import Piece from './piece.model.js';

export default class King extends Piece {
  constructor(color, position) {
    super('king', color, position, color === 'white' ? '♔' : '♚');
  }

  generatePossibleMoves(board) {
    const moves = [];
    const [file, rank] = this.position.split('');
    const currentRank = parseInt(rank);
    const fileIndex = file.charCodeAt(0);

    const potentialMoves = [
      [fileIndex + 1, currentRank], [fileIndex - 1, currentRank],
      [fileIndex, currentRank + 1], [fileIndex, currentRank - 1],
      [fileIndex + 1, currentRank + 1], [fileIndex - 1, currentRank - 1],
      [fileIndex + 1, currentRank - 1], [fileIndex - 1, currentRank + 1]
    ];

    potentialMoves.forEach(([f, r]) => {
      if (f >= 97 && f <= 104 && r >= 1 && r <= 8) {
        const move = `${String.fromCharCode(f)}${r}`;
        if (!board[move] || board[move].color !== this.color) {
          moves.push(move);
        }
      }
    });

    return moves;
  }
}
