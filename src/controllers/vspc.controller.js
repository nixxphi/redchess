
import { generateValidMoves } from './piece.controller.js';
import { evaluateMove } from './evaluationFunctions.js';

const difficultySettings = {
  easy: {
    depth: 1,
    randomize: true,
  },
  medium: {
    depth: 2,
    randomize: false,
  },
  hard: {
    depth: 3,
    randomize: false,
  },
};

const vspc = {
  difficulty: 'medium', // Default difficulty

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  },

  generateMove(board, currentTurn) {
    const possibleMoves = [];
    for (const position in board) {
      const piece = board[position];
      if (piece && piece.color === currentTurn) {
        const validMoves = generateValidMoves(piece, board);
        possibleMoves.push(...validMoves.map(move => ({ piece, move })));
      }
    }

    if (difficultySettings[this.difficulty].randomize) {
      // Randomize move selection for easier difficulties
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randomIndex].move;
    }

    const bestMove = this.minimax(possibleMoves, board, currentTurn, difficultySettings[this.difficulty].depth);
    return bestMove.move;
  },

  minimax(moves, board, currentTurn, depth) {
    if (depth === 0) {
      // Evaluate moves using the evaluation function
      return moves.reduce((best, current) => {
        const score = evaluateMove(current.move, board);
        if (score > best.score) {
          return { ...current, score };
        }
        return best;
      }, { score: -Infinity });
    }

    // Recursively explore moves for the opponent's turn
    const opponentTurn = currentTurn === 'white' ? 'black' : 'white';
    const opponentMoves = this.generatePossibleMoves(board, opponentTurn);
    const opponentBestMove = this.minimax(opponentMoves, board, opponentTurn, depth - 1);

    // Evaluate moves based on the opponent's best response
    return moves.reduce((best, current) => {
      const score = evaluateMove(current.move, board) - opponentBestMove.score;
      if (score > best.score) {
        return { ...current, score };
      }
      return best;
    }, { score: -Infinity });
  },

  generatePossibleMoves(board, currentTurn) {
    const possibleMoves = [];
    for (const position in board) {
      const piece = board[position];
      if (piece && piece.color === currentTurn) {
        const validMoves = generateValidMoves(piece, board);
        possibleMoves.push(...validMoves.map(move => ({ piece, move })));
      }
    }
    return possibleMoves;
  },
};

export default vspc;