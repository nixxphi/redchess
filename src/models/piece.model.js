export default class Piece {
  constructor(type, color, position, symbol) {
    this.type = type; // Piece type (e.g., pawn, knight, bishop, rook, queen, king)
    this.color = color; // Piece color (white or black)
    this.position = position; // Current position on the board (e.g., e4, d5, etc.)
    this.symbol = symbol; // Symbol representing the piece (e.g., ♙, ♘, ♗, etc.)
    this.hasMoved = false; // Whether the piece has moved from its starting position
    this.captured = false; // Whether the piece has been captured
  }

  // Method to update the piece's position
  move(newPosition) {
    this.position = newPosition;
    this.hasMoved = true;
  }

  // Method to mark the piece as captured
  capture() {
    this.captured = true;
  }

  // Placeholder method to be overridden in subclasses
  generatePossibleMoves(board) {
    throw new Error('Method generatePossibleMoves must be implemented in subclasses');
  }

  // Method to check if a move is valid
  isValidMove(move, board) {
    return this.generatePossibleMoves(board).includes(move);
  }
}
￼Enter
