import { GameState } from './gameState.js';

describe('GameState.canStartGame', () => {
  test('Happy-path – both fleets ready', () => {
    const gs = new GameState();
    expect(gs.canStartGame(true, true)).toBe(true);
  });

  test('Boundary – one fleet not ready', () => {
    const gs = new GameState();
    expect(gs.canStartGame(true, false)).toBe(false);
  });

  test('Invalid – called outside setup phase', () => {
    const gs = new GameState();
    gs.startGame();
    expect(() => gs.canStartGame(true, true)).toThrow('INVALID_PHASE');
  });
});

describe('GameState.startGame', () => {
  test('Happy-path – transition to gameplay', () => {
    const gs = new GameState();
    const events = [];
    gs.on('GAME_STARTED', (e) => events.push(e));
    gs.startGame();
    expect(gs.getCurrentPhase()).toBe('gameplay');
    expect(gs.currentTurn).toBe('player');
    expect(events.length).toBe(1);
    expect(events[0].firstPlayer).toBe('player');
  });

  test('Invalid – phase not setup', () => {
    const gs = new GameState();
    gs.startGame();
    expect(() => gs.startGame()).toThrow('INVALID_PHASE');
  });
});

describe('GameState.switchTurn', () => {
  test('Happy-path – toggles player', () => {
    const gs = new GameState();
    gs.startGame();
    const events = [];
    gs.on('TURN_CHANGED', (e) => events.push(e));
    gs.switchTurn();
    expect(gs.currentTurn).toBe('computer');
    expect(gs.turnNumber).toBe(2);
    expect(events[0].previousPlayer).toBe('player');
    expect(events[0].nextPlayer).toBe('computer');
  });

  test('Boundary – two sequential switches', () => {
    const gs = new GameState();
    gs.startGame();
    gs.switchTurn();
    gs.switchTurn();
    expect(gs.currentTurn).toBe('player');
    expect(gs.turnNumber).toBe(3);
  });

  test('Invalid – called before game started', () => {
    const gs = new GameState();
    expect(() => gs.switchTurn()).toThrow('INVALID_PHASE');
  });
});

describe('GameState.isPlayerTurn', () => {
  test('Before start', () => {
    const gs = new GameState();
    expect(gs.isPlayerTurn()).toBe(false);
  });

  test('After start and first turn', () => {
    const gs = new GameState();
    gs.startGame();
    expect(gs.isPlayerTurn()).toBe(true);
    gs.switchTurn();
    expect(gs.isPlayerTurn()).toBe(false);
  });
});

describe('GameState.endGame', () => {
  test('Happy-path – declare winner', () => {
    const gs = new GameState();
    gs.startGame();
    const events = [];
    gs.on('GAME_ENDED', (e) => events.push(e));
    gs.endGame('player');
    expect(gs.getCurrentPhase()).toBe('endgame');
    expect(gs.winner).toBe('player');
    expect(events.length).toBe(1);
    expect(events[0].winner).toBe('player');
  });

  test('Invalid – called outside gameplay', () => {
    const gs = new GameState();
    expect(() => gs.endGame('player')).toThrow('INVALID_PHASE');
  });
});

describe('GameState.getCurrentPhase', () => {
  test('Returns correct phases through lifecycle', () => {
    const gs = new GameState();
    expect(gs.getCurrentPhase()).toBe('setup');
    gs.startGame();
    expect(gs.getCurrentPhase()).toBe('gameplay');
    gs.endGame('player');
    expect(gs.getCurrentPhase()).toBe('endgame');
  });
});

describe('GameState.reset', () => {
  test('Stateful reset – after gameplay', () => {
    const gs = new GameState();
    gs.startGame();
    gs.switchTurn();
    const events = [];
    gs.on('GAME_RESET', (e) => events.push(e));
    gs.reset();
    expect(gs.getCurrentPhase()).toBe('setup');
    expect(gs.currentTurn).toBeNull();
    expect(gs.winner).toBeNull();
    expect(gs.turnNumber).toBe(0);
    expect(events[0].previousPhase).toBe('gameplay');
  });

  test('Edge – idempotent reset', () => {
    const gs = new GameState();
    gs.reset();
    const snapshot = JSON.stringify(gs);
    gs.reset();
    expect(JSON.stringify(gs)).toBe(snapshot);
  });
});

// Integration workflow scenario

describe('Workflow – full lifecycle', () => {
  test('Start, play, end, reset', () => {
    const gs = new GameState();
    gs.startGame();
    gs.switchTurn();
    gs.switchTurn();
    gs.endGame('computer');
    expect(gs.getCurrentPhase()).toBe('endgame');
    expect(gs.winner).toBe('computer');
    gs.reset();
    expect(gs.getCurrentPhase()).toBe('setup');
    expect(gs.currentTurn).toBeNull();
  });
});
