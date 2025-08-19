/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { AIStrategy } from '../ai_strategy/aiStrategy.js';

class PvCGame {
  constructor(playerBoard, opponentBoard) {
    this.playerBoard = playerBoard;
    this.opponentBoard = opponentBoard;
    this.aiStrategy = new AIStrategy(playerBoard);

    this.gamePhase = 'player-turn';
    this.cellClickHandlers = new Map();
    this.setUp();
  }

  setUp() {
    const cellsForSelection = document.querySelectorAll('#computer .cell');
    cellsForSelection.forEach((cell) => {
      const handler = () => this.handlePlayerGuess(cell);
      this.cellClickHandlers.set(cell, handler);
      cell.addEventListener('click', handler);
    });
  }

  handlePlayerGuess(cell) {
    if (this.gamePhase !== 'player-turn') return;
    // eslint-disable-next-line prefer-destructuring
    const coordinate = cell.dataset.coordinate;
    this.opponentBoard.markGuess(coordinate);
    if (this.opponentBoard.isHitSuccessful(coordinate)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const ship of Object.values(this.opponentBoard.ships)) {
        if (ship.cellsOccupied.includes(coordinate)) {
          ship.recordHit(coordinate);
          this.showHit(cell);
          if (ship.checkIfSunk() && this.opponentBoard.areAllShipsSunk()) {
            this.onPlayerWin();
          }
          break;
        }
      }
    } else {
      this.showMiss(cell);
    }
    this.gamePhase = 'computer-turn';
    this.executeComputerTurn();
  }

  executeComputerTurn() {
    const coordinate = this.aiStrategy.getNextMove();
    const cell = document.querySelector(
      `#player [data-coordinate="${coordinate}"]`
    );
    if (!coordinate) {
      console.warn('AI returned no move; ending turn safely.');
      this.gamePhase = 'player-turn';
      return;
    }

    if (this.playerBoard.isHitSuccessful(coordinate)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const ship of Object.values(this.playerBoard.ships)) {
        if (ship.cellsOccupied.includes(coordinate)) {
          ship.recordHit(coordinate);
          this.showHit(cell);
          if (this.playerBoard.areAllShipsSunk()) {
            this.onComputerWin();
          }
          break;
        }
      }
    } else {
      this.showMiss(cell);
    }
    this.gamePhase = 'player-turn';
  }

  showHit(cell) {
    cell.style.backgroundColor = 'rgba(248, 3, 252, 0.4)';
    this.removeClickListener(cell);
  }

  showMiss(cell) {
    cell.style.backgroundColor = 'transparent';
    this.removeClickListener(cell);
  }

  removeClickListener(cell) {
    const handler = this.cellClickHandlers.get(cell);
    cell.removeEventListener('click', handler);
    this.cellClickHandlers.delete(cell);
  }

  onPlayerWin() {
    this.gamePhase = 'player-win';
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('player-wins').classList.remove('hidden');
    document.getElementById('play-again').classList.remove('hidden');
  }

  onComputerWin() {
    this.gamePhase = 'computer-win';
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('computer-wins').classList.remove('hidden');
    document.getElementById('play-again').classList.remove('hidden');
  }
}

// eslint-disable-next-line import/prefer-default-export
export { PvCGame };
