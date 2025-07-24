import { GameController } from './gameController.js';

// Mock dependencies
const mockPlayerFleet = {
  placeShip: jest.fn(),
  rotateShip: jest.fn(),
  recordAttack: jest.fn(),
  areAllShipsPlaced: jest.fn(),
  areAllShipsSunk: jest.fn(),
  reset: jest.fn(),
};
const mockComputerFleet = {
  recordAttack: jest.fn(),
  areAllShipsSunk: jest.fn(),
  reset: jest.fn(),
};
const mockGameState = {
  startGame: jest.fn(),
  switchTurn: jest.fn(),
  endGame: jest.fn(),
  getCurrentPhase: jest.fn(() => 'setup'),
  isPlayerTurn: jest.fn(),
  reset: jest.fn(),
};
const mockAIStrategy = {
  getNextMove: jest.fn(),
  recordResult: jest.fn(),
  reset: jest.fn(),
};
const mockUIRenderer = {
  renderBoard: jest.fn(),
  renderShip: jest.fn(),
  showHit: jest.fn(),
  showMiss: jest.fn(),
  toggleSetupUI: jest.fn(),
  showEndgame: jest.fn(),
};
const mockDragDrop = { cancelDrag: jest.fn(), isDragging: jest.fn() };

class MockEventBus {
  constructor() {
    this.events = [];
  }

  emit(e) {
    this.events.push(e);
  }

  subscribe(type, handler) {
    this.events.push({ sub: type });
    return () => {};
  }
}

let controller;
let bus;

beforeEach(() => {
  jest.clearAllMocks();
  bus = new MockEventBus();
  controller = new GameController({
    playerFleet: mockPlayerFleet,
    computerFleet: mockComputerFleet,
    gameState: mockGameState,
    aiStrategy: mockAIStrategy,
    uiRenderer: mockUIRenderer,
    dragDropController: mockDragDrop,
    eventBus: bus,
  });
});

describe('GameController.initializeGame', () => {
  test('Happy path emits init event', () => {
    controller.initializeGame();
    expect(bus.events[0]).toMatchObject({ type: 'GAME_INITIALIZED' });
  });
});

describe('GameController.handleShipPlacement', () => {
  test('Delegates placement to fleet when in setup phase', () => {
    mockGameState.getCurrentPhase.mockReturnValue('setup');
    controller.handleShipPlacement('destroyer', 0, 0, 'horizontal');
    expect(mockPlayerFleet.placeShip).toHaveBeenCalledWith(
      'destroyer',
      0,
      0,
      'horizontal'
    );
  });

  test('Emits placement invalid event on domain error', () => {
    mockGameState.getCurrentPhase.mockReturnValue('setup');
    mockPlayerFleet.placeShip.mockImplementation(() => {
      throw new Error('SHIP_OUT_OF_BOUNDS');
    });
    controller.handleShipPlacement('patrol', 9, 9, 'horizontal');
    expect(bus.events.find((e) => e.type === 'PLACEMENT_INVALID')).toBeTruthy();
  });
});

describe('GameController.handleShipRotation', () => {
  test('Delegates rotation to fleet', () => {
    controller.handleShipRotation('patrol');
    expect(mockPlayerFleet.rotateShip).toHaveBeenCalledWith('patrol');
  });
});

describe('GameController.handleStartGame', () => {
  test('Starts game when all ships placed', () => {
    mockPlayerFleet.areAllShipsPlaced.mockReturnValue(true);
    mockComputerFleet.areAllShipsSunk.mockReturnValue(false);
    controller.handleStartGame();
    expect(mockGameState.startGame).toHaveBeenCalled();
  });

  test('Throws when not all ships placed', () => {
    mockPlayerFleet.areAllShipsPlaced.mockReturnValue(false);
    expect(() => controller.handleStartGame()).toThrow();
  });
});

describe('GameController.handlePlayerGuess', () => {
  test('Processes guess and switches turn', () => {
    mockGameState.isPlayerTurn.mockReturnValue(true);
    mockPlayerFleet.areAllShipsSunk.mockReturnValue(false);
    mockComputerFleet.recordAttack.mockReturnValue({ hit: false });
    controller.handlePlayerGuess(0, 0);
    expect(mockComputerFleet.recordAttack).toHaveBeenCalled();
    expect(mockGameState.switchTurn).toHaveBeenCalled();
  });

  test('Emits error event when not player turn', () => {
    mockGameState.isPlayerTurn.mockReturnValue(false);
    controller.handlePlayerGuess(0, 0);
    expect(bus.events.find((e) => e.type === 'INVALID_GUESS')).toBeTruthy();
  });
});

describe('GameController.executeComputerTurn', () => {
  test('AI move followed by attack and turn switch', () => {
    mockGameState.isPlayerTurn.mockReturnValue(false);
    mockAIStrategy.getNextMove.mockReturnValue('1,1');
    mockPlayerFleet.recordAttack.mockReturnValue({ hit: true });
    controller.executeComputerTurn();
    expect(mockAIStrategy.getNextMove).toHaveBeenCalled();
    expect(mockPlayerFleet.recordAttack).toHaveBeenCalledWith('1,1');
    expect(mockGameState.switchTurn).toHaveBeenCalled();
  });
});

describe('GameController.handleReset', () => {
  test('Resets all modules and emits event', () => {
    controller.handleReset();
    expect(mockPlayerFleet.reset).toHaveBeenCalled();
    expect(mockComputerFleet.reset).toHaveBeenCalled();
    expect(mockGameState.reset).toHaveBeenCalled();
    expect(mockAIStrategy.reset).toHaveBeenCalled();
    expect(bus.events.find((e) => e.type === 'GAME_RESET')).toBeTruthy();
  });
});

describe('GameController.addEventListener', () => {
  test('Subscribes via event bus', () => {
    const handler = jest.fn();
    controller.addEventListener('TEST', handler);
    expect(bus.events.find((e) => e.sub === 'TEST')).toBeTruthy();
  });
});

describe('GameController.getGameStatus', () => {
  test('Returns summary from game state', () => {
    mockGameState.getCurrentPhase.mockReturnValue('gameplay');
    const status = controller.getGameStatus();
    expect(status.phase).toBe('gameplay');
  });
});
