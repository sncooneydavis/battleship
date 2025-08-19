/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class PvPGame {
  constructor(playerBoard, opponentBoard) {
    this.playerBoard = playerBoard;
    this.opponentBoard = opponentBoard;

    this.gamePhase = 'setup';
    this.setUp();
  }

  setUp() {
    document.querySelector('#opponent .cell');
  }

  handlePlayerGuess(x, y) {
    const coord = `${x},${y}`;
    if (!this.gameState.isPlayerTurn()) {
      this.eventBus.emit({
        type: 'INVALID_GUESS',
        playerId: 'player',
        target: coord,
        reason: 'NOT_YOUR_TURN',
        timestamp: Date.now(),
      });
      return;
    }

    let result;
    try {
      result = this.computerFleet.recordAttack(coord);
    } catch (error) {
      this.eventBus.emit({
        type: 'INVALID_GUESS',
        playerId: 'player',
        target: coord,
        reason: error.message,
        timestamp: Date.now(),
      });
      return;
    }

    this.eventBus.emit({
      type: 'GUESS_MADE',
      playerId: 'player',
      target: coord,
      result,
      timestamp: Date.now(),
    });

    if (
      this.computerFleet.areAllShipsSunk &&
      this.computerFleet.areAllShipsSunk()
    ) {
      this.gameState.endGame('player');
    } else {
      this.gameState.switchTurn();
    }
  }

  executeComputerTurn() {
    if (this.gameState.isPlayerTurn()) return;
    const coord = this.aiStrategy.getNextMove(this.playerFleet.board);
    const result = this.playerFleet.recordAttack(coord);
    this.aiStrategy.recordResult(coord, result, this.playerFleet.board);
    this.eventBus.emit({
      type: 'GUESS_MADE',
      playerId: 'computer',
      target: coord,
      result,
      timestamp: Date.now(),
    });
    if (
      this.playerFleet.areAllShipsSunk &&
      this.playerFleet.areAllShipsSunk()
    ) {
      this.gameState.endGame('computer');
    } else {
      this.gameState.switchTurn();
    }
  }

  handleReset() {
    if (
      this.dragDropController &&
      this.dragDropController.isDragging &&
      this.dragDropController.isDragging()
    ) {
      try {
        this.dragDropController.cancelDrag();
      } catch (e) {
        // ignore
      }
    }
    this.playerFleet.reset();
    this.computerFleet.reset();
    this.gameState.reset();
    this.aiStrategy.reset();
    this.eventBus.emit({ type: 'GAME_RESET', timestamp: Date.now() });
  }

  addEventListener(eventType, handler) {
    this.eventBus.subscribe(eventType, handler);
  }

  getGameStatus() {
    return { phase: this.gameState.getCurrentPhase() };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { PvPGame };
