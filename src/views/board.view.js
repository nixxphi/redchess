// ./views/board.view.js

export default class ChessboardView {
    constructor(boardElement, gameController) {
      this.boardElement = boardElement; // DOM element to render the board
      this.gameController = gameController; // Reference to the game logic controller
      this.selectedSquare = null;
      this.highlightedSquares = []; // Array to keep track of highlighted squares
      this.renderBoard();
    }
  
    // Method to render the chessboard on the webpage
    renderBoard() {
      const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
      const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
      // Clear existing board
      this.boardElement.innerHTML = '';
  
      // Create 8x8 grid for the chessboard
      for (let row of rows.reverse()) {
        for (let col of columns) {
          const square = document.createElement('div');
          square.classList.add('chess-square', (col.charCodeAt(0) + parseInt(row)) % 2 === 0 ? 'dark-square' : 'light-square');
          square.id = col + row;
  
          // Add click listener to each square
          square.addEventListener('click', () => this.handleSquareClick(col + row));
  
          this.boardElement.appendChild(square);
        }
      }
    }
  
    // Updates the chessboard with piece positions
    updateBoard(board) {
      this.renderBoard();
      for (const position in board) {
        const piece = board[position];
        if (piece) {
          this.placePiece(piece, position);
        }
      }
    }
  
    // Places a piece on the board at the specified position
    placePiece(piece, position) {
      const square = document.getElementById(position);
      const pieceElement = document.createElement('span');
      pieceElement.innerHTML = piece.symbol;
      pieceElement.classList.add('chess-piece', piece.color);
      square.appendChild(pieceElement);
    }
  
    // Handles the event when a square is clicked
    handleSquareClick(position) {
      if (this.selectedSquare) {
        this.gameController.handleMove(this.selectedSquare, position); // Pass move to the game controller
        this.clearHighlights(); 
        this.selectedSquare = null;
      } else {
        this.selectedSquare = position;
        this.highlightPossibleMoves(position);
      }
    }
  
    // Highlights the possible moves for the selected piece
    highlightPossibleMoves(position) {
      // Clear any previous highlights
      this.clearHighlights();
  
      // Get possible moves from the game controller
      const piece = this.getPieceAtPosition(position);
      if (piece) {
        const possibleMoves = piece.generatePossibleMoves(this.gameController.board);
  
        // Add highlight class to possible move squares
        this.highlightedSquares = possibleMoves;
        for (const move of possibleMoves) {
          const square = document.getElementById(move);
          if (square) {
            square.classList.add('highlight');
          }
        }
      }
    }
  
    // Clears all highlighted squares
    clearHighlights() {
      this.highlightedSquares.forEach(pos => {
        const square = document.getElementById(pos);
        if (square) {
          square.classList.remove('highlight');
        }
      });
      this.highlightedSquares = [];
    }
  
    // Get the piece at a specific position
    getPieceAtPosition(position) {
      return this.gameController.board[position];
    }
  }
  