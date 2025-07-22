import { EventEmitter } from 'node:events';

class GameState {
  constructor() {
    this.phase = 'setup';
    this.currentTurn = null;
    this.winner = null;
    this.turnNumber = 0;
    this.emitter = new EventEmitter();
  }

  on(event, handler) {
    this.emitter.on(event, handler);
  }

  emit(event, payload) {
    this.emitter.emit(event, payload);
  }

  canStartGame(playerFleetReady, computerFleetReady) {
    if (this.phase !== 'setup') throw new Error('INVALID_PHASE');
    return Boolean(playerFleetReady && computerFleetReady);
  }

  startGame() {
    if (this.phase !== 'setup') throw new Error('INVALID_PHASE');
    this.phase = 'gameplay';
    this.currentTurn = 'player';
    this.turnNumber = 1;
    this.emit('GAME_STARTED', {
      firstPlayer: 'player',
      timestamp: Date.now(),
    });
  }

  switchTurn() {
    if (this.phase !== 'gameplay') throw new Error('INVALID_PHASE');
    if (!this.currentTurn) throw new Error('GAME_NOT_STARTED');
    const previousPlayer = this.currentTurn;
    this.currentTurn = previousPlayer === 'player' ? 'computer' : 'player';
    this.turnNumber += 1;
    this.emit('TURN_CHANGED', {
      previousPlayer,
      nextPlayer: this.currentTurn,
      turnNumber: this.turnNumber,
      timestamp: Date.now(),
    });
  }

  isPlayerTurn() {
    return this.currentTurn === 'player';
  }

  endGame(winner) {
    if (this.phase !== 'gameplay') throw new Error('INVALID_PHASE');
    this.phase = 'endgame';
    this.winner = winner;
    this.emit('GAME_ENDED', {
      winner,
      timestamp: Date.now(),
    });
  }

  getCurrentPhase() {
    return this.phase;
  }

  reset() {
    const previousPhase = this.phase;
    this.phase = 'setup';
    this.currentTurn = null;
    this.winner = null;
    this.turnNumber = 0;
    this.emit('GAME_RESET', {
      previousPhase,
      timestamp: Date.now(),
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { GameState };
