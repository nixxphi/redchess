// ./evaluationFunctions.js

const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: Infinity,
  };
  
  const evaluationFunctions = {
    // Simple piece value evaluation
    pieceValue(move, board) {
      const piece = board[move.from];
      return pieceValues[piece.type];
    },
  
    // Control of the center evaluation
    controlCenter(move, board) {
      const centerSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centerSquares.includes(move.to)) {
        return 1;
      }
      return 0;
    },
  
    // Piece development evaluation
    pieceDevelopment(move, board) {
      const piece = board[move.from];
      if (piece.type === 'pawn') {
        return 0;
      }
      if (piece.hasMoved) {
        return 0;
      }
      return 1;
    },
  
    // King safety evaluation
    kingSafety(move, board) {
      const kingPosition = findKingPosition(board, move.color);
      const opponentColor = move.color === 'white' ? 'black' : 'white';
      const opponentPieces = getOpponentPieces(board, opponentColor);
      const distanceToKing = distanceBetweenSquares(move.to, kingPosition);
      if (opponentPieces.some(piece => piece.type === 'queen' && distanceToKing <= 3)) {
        return -1;
      }
      return 0;
    },
  };
  
  function findKingPosition(board, color) {
    for (const position in board) {
      const piece = board[position];
      if (piece && piece.type === 'king' && piece.color === color) {
        return position;
      }
    }
    throw new Error('King not found');
  }
  
  function getOpponentPieces(board, color) {
    return Object.values(board).filter(piece => piece && piece.color !== color);
  }
  
  function distanceBetweenSquares(square1, square2) {
    const rank1 = parseInt(square1[1]);
    const file1 = square1[0].charCodeAt(0) - 97;
    const rank2 = parseInt(square2[1]);
    const file2 = square2[0].charCodeAt(0) - 97;
    return Math.max(Math.abs(rank1 - rank2), Math.abs(file1 - file2));
  }
  
  export function evaluateMove(move, board) {
    return Object.values(evaluationFunctions).reduce((total, func) => total + func(move, board), 0);
  }