class GameState {
  constructor(eventBus) {
    this.phase = 'setup';
    this.currentTurn = null;
    this.winner = null;
    this.turnNumber = 0;
    this.eventBus = eventBus;
  }

  startGame() {
    this.phase = 'gameplay';
    this.currentTurn = 'player';
    this.turnNumber = 1;
    this.eventBus('GAME_STARTED', {
      firstPlayer: 'player',
      timestamp: Date.now(),
    });
  }

  switchTurn() {
    if (this.phase !== 'gameplay') throw new Error('INVALID_PHASE');
    if (!this.currentTurn) throw new Error('GAME_NOT_STARTED');
    const previousPlayer = this.currentTurn;
    this.currentTurn = previousPlayer === 'player' ? 'opponent' : 'player';
    this.turnNumber += 1;
    this.eventBus('TURN_CHANGED', {
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
    this.eventBus('GAME_ENDED', {
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
    this.eventBus('GAME_RESET', {
      previousPhase,
      timestamp: Date.now(),
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { GameState };
