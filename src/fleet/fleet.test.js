import { EventEmitter } from 'node:events';
import { Fleet } from './fleet.js';
import { GameBoard } from '../game_board/gameBoard.js';
import { Ship } from '../ship/ship.js';

let board;
let ships;
let fleet;
let emitter;

const createShips = () => ({
  carrier: new Ship('carrier', 5),
  battleship: new Ship('battleship', 4),
  destroyer: new Ship('destroyer', 3),
  submarine: new Ship('submarine', 3),
  patrol: new Ship('patrol', 2),
});

beforeEach(() => {
  board = new GameBoard();
  ships = createShips();
  emitter = new EventEmitter();
  fleet = new Fleet('player', board, ships, emitter);
});

describe('Fleet.placeShip', () => {
  test('Happy-path - places ship and emits event', () => {
    const events = [];
    emitter.on('SHIP_PLACED', (e) => events.push(e));
    fleet.placeShip('destroyer', 1, 1, 'horizontal');
    expect(ships.destroyer.isPlaced).toBe(true);
    expect(board.getCellState('1,1')).toBe('occupied');
    expect(events[0]).toMatchObject({
      type: 'SHIP_PLACED',
      shipId: 'destroyer',
      position: { x: 1, y: 1 },
      orientation: 'horizontal',
      affectedCells: ['1,1', '2,1', '3,1'],
    });
  });

  test('Invalid - overlap detection', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    expect(() => fleet.placeShip('destroyer', 0, 0, 'vertical')).toThrow(
      'SHIP_OVERLAP'
    );
  });

  test('Invalid - out of bounds', () => {
    const events = [];
    emitter.on('PLACEMENT_INVALID', (e) => events.push(e));
    expect(() => fleet.placeShip('patrol', 9, 9, 'horizontal')).toThrow(
      'SHIP_OUT_OF_BOUNDS'
    );
    expect(events[0]).toMatchObject({
      type: 'PLACEMENT_INVALID',
      shipId: 'patrol',
      attemptedPosition: { x: 9, y: 9 },
      reason: 'OUT_OF_BOUNDS',
    });
  });
});

describe('Fleet.rotateShip', () => {
  test('Happy-path - rotates and emits event', () => {
    const events = [];
    emitter.on('SHIP_ROTATED', (e) => events.push(e));
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    fleet.rotateShip('patrol');
    expect(ships.patrol.orientation).toBe('vertical');
    expect(board.getCellState('0,1')).toBe('occupied');
    expect(events[0]).toMatchObject({
      type: 'SHIP_ROTATED',
      shipId: 'patrol',
      previousOrientation: 'horizontal',
      newOrientation: 'vertical',
    });
  });

  test('Invalid - rotation causes overlap', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    fleet.placeShip('destroyer', 0, 1, 'horizontal');
    expect(() => fleet.rotateShip('patrol')).toThrow('SHIP_OVERLAP');
  });
});

describe('Fleet.areAllShipsPlaced', () => {
  test('Returns true only when all ships placed', () => {
    expect(fleet.areAllShipsPlaced()).toBe(false);
    Object.keys(ships).forEach((id, idx) => {
      fleet.placeShip(id, 0, idx, 'horizontal');
    });
    expect(fleet.areAllShipsPlaced()).toBe(true);
  });
});

describe('Fleet.getShipAt', () => {
  test('Returns ship instance at given coordinate', () => {
    fleet.placeShip('patrol', 2, 2, 'horizontal');
    expect(fleet.getShipAt('2,2')).toBe(ships.patrol);
    expect(fleet.getShipAt('5,5')).toBeNull();
  });
});

describe('Fleet.recordAttack', () => {
  test('Registers hit on ship', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    const result = fleet.recordAttack('0,0');
    expect(result).toEqual({
      hit: true,
      shipId: 'patrol',
      shipSunk: false,
      coordinates: '0,0',
    });
    expect(board.getCellState('0,0')).toBe('hit');
  });

  test('Registers miss', () => {
    const result = fleet.recordAttack('5,5');
    expect(result.hit).toBe(false);
    expect(board.getCellState('5,5')).toBe('miss');
  });

  test('Invalid - attacking same cell twice', () => {
    fleet.recordAttack('5,5');
    expect(() => fleet.recordAttack('5,5')).toThrow('CELL_ALREADY_GUESSED');
  });
});

describe('Fleet.areAllShipsSunk', () => {
  test('Detects when all ships are sunk', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    fleet.recordAttack('0,0');
    fleet.recordAttack('1,0');
    expect(fleet.areAllShipsSunk()).toBe(false);
    fleet.placeShip('destroyer', 2, 0, 'horizontal');
    fleet.recordAttack('2,0');
    fleet.recordAttack('3,0');
    fleet.recordAttack('4,0');
    expect(fleet.areAllShipsSunk()).toBe(true);
  });
});

describe('Fleet.validatePlacement', () => {
  test('Validation object for legal placement', () => {
    const result = fleet.validatePlacement('patrol', 0, 0, 'horizontal');
    expect(result).toMatchObject({
      isWithinBounds: true,
      hasNoOverlap: true,
      shipNotAlreadyPlaced: true,
    });
  });

  test('Detects overlap and out of bounds', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    const result = fleet.validatePlacement('destroyer', 9, 9, 'horizontal');
    expect(result.isWithinBounds).toBe(false);
    const overlap = fleet.validatePlacement('destroyer', 0, 0, 'vertical');
    expect(overlap.hasNoOverlap).toBe(false);
    expect(overlap.shipNotAlreadyPlaced).toBe(true);
  });
});

describe('Fleet.reset', () => {
  test('Resets board and ships', () => {
    fleet.placeShip('patrol', 0, 0, 'horizontal');
    fleet.recordAttack('0,0');
    fleet.reset();
    expect(board.shipPositions.size).toBe(0);
    Object.values(ships).forEach((ship) => {
      expect(ship.isPlaced).toBe(false);
    });
  });
});
