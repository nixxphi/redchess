

export default class GameControls {
    constructor(gameController) {
      this.gameController = gameController;
      this.bindControls();
    }
  
    bindControls() {
      const newGameButton = document.getElementById('new-game-button');
      newGameButton.addEventListener('click', () => this.gameController.startNewGame());
  
      const undoButton = document.getElementById('undo-button');
      undoButton.addEventListener('click', () => this.gameController.undoLastMove());
    }
  }
  