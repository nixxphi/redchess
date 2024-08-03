// ./models/knight.model.js

import Piece from './piece.model.js';

export default class Knight extends Piece {
  constructor(color, position) {
    super('knight', color, position, color === 'white' ? '♘' : '♞');
  }

  generatePossibleMoves(board) {
    const moves = [];
    const [file, rank] = this.position.split('');
    const currentRank = parseInt(rank);
    const fileIndex = file.charCodeAt(0);

    const potentialMoves = [
      [fileIndex + 1, currentRank + 2], [fileIndex + 1, currentRank - 2],
      [fileIndex - 1, currentRank + 2], [fileIndex - 1, currentRank - 2],
      [fileIndex + 2, currentRank + 1], [fileIndex + 2, currentRank - 1],
      [fileIndex - 2, currentRank + 1], [fileIndex - 2, currentRank - 1]
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
