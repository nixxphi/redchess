
export default class PieceView {
    constructor(piece, squareElement) {
      this.piece = piece;
      this.squareElement = squareElement;
    }
  
    render() {
      const pieceElement = document.createElement('span');
      pieceElement.classList.add('piece');
      pieceElement.innerHTML = this.piece.symbol;
      this.squareElement.appendChild(pieceElement);
    }
  
    moveTo(newSquareElement) {
      const oldSquare = this.squareElement;
      const pieceElement = oldSquare.querySelector('.piece');
  
      newSquareElement.appendChild(pieceElement); 
      oldSquare.innerHTML = ''; 
      this.squareElement = newSquareElement;
    }
  }
  