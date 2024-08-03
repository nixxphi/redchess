// ./models/queen.model.js

import Piece from './piece.model.js';

export default class Queen extends Piece {
  constructor(color, position) {
    super('queen', color, position, color === 'white' ? '♕' : '♛');
  }

  generatePossibleMoves(board) {
    const moves = [];
    const [file, rank] = this.position.split('');
    const currentRank = parseInt(rank);
    const fileIndex = file.charCodeAt(0);

    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1], // Diagonal
      [1, 0], [-1, 0], [0, 1], [0, -1]   // Straight
    ];

    directions.forEach(([fDir, rDir]) => {
      for (let i = 1; i < 8; i++) {
        const newFile = fileIndex + i * fDir;
        const newRank = currentRank + i * rDir;
        if (newFile >= 97 && newFile <= 104 && newRank >= 1 && newRank <= 8) {
          const move = `${String.fromCharCode(newFile)}${newRank}`;
          if (!board[move]) {
            moves.push(move);
          } else {
            if (board[move].color !== this.color) {
              moves.push(move);
            }
            break;
          }
        } else {
          break;
        }
      }
    });

    return moves;
  }
}
