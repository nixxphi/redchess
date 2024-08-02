
export default class Game {
  constructor() {
    this.id = null; // unique game ID
    this.player1 = null; // player 1 ID (foreign key)
    this.player2 = null; // player 2 ID (foreign key)
    this.board = []; // 8x8 array representing the chessboard
    this.turn = 'white'; // current turn (white or black)
    this.status = 'ongoing'; // game status (ongoing, checkmate, stalemate, etc.)
    this.moves = []; // array of moves made in the game
  }
}
