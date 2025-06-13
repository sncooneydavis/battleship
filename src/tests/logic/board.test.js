import { createGameboard } from '../../logic/board.js';

// gameboard.test.js

const createMockShip = (length) => {
  return {
    getLength: jest.fn(() => length),
  };
};

describe('gameboard module', () => {
  let board;

  beforeEach(() => {
    board = createGameboard();
  });

  describe('Ship placement', () => {
    it('places a ship within bounds', () => {
      const ship = createMockShip(3);
      const result = board.placeShip(ship, [0, 0], 'horizontal');
      expect(result).toBe(true);
    });

    it('rejects out-of-bounds placement', () => {
      const ship = createMockShip(4);
      const result = board.placeShip(ship, [8, 9], 'horizontal');
      expect(result).toBe(false);
    });

    it('rejects overlapping ships', () => {
      const ship1 = createMockShip(3);
      const ship2 = createMockShip(3);
      board.placeShip(ship1, [2, 2], 'horizontal');
      const result = board.placeShip(ship2, [3, 2], 'horizontal');
      expect(result).toBe(false);
    });
  });

  describe('Attacking behavior', () => {
    it('registers a hit when attacking a ship', () => {
      const ship = createMockShip(2);
      board.placeShip(ship, [5, 5], 'vertical');
      const result = board.receiveAttack([5, 5]);
      expect(result).toBe('hit');
    });

    it('registers a miss when attacking empty water', () => {
      const result = board.receiveAttack([0, 0]);
      expect(result).toBe('miss');
    });

    it('ignores repeated attacks on the same square', () => {
      const ship = createMockShip(1);
      board.placeShip(ship, [1, 1], 'horizontal');
      board.receiveAttack([1, 1]);
      const result = board.receiveAttack([1, 1]);
      expect(result).toBe('already attacked');
    });
  });

  // MAKE INTEGRATION TEST INSTEAD
  // describe('Game over condition', () => {
  //   it('returns true when all ships are sunk', () => {
  //     const ship = createMockShip(1);
  //     ship.isSunk = jest.fn(() => true);
  //     board.placeShip(ship, [0, 0], 'horizontal');
  //     board.receiveAttack([0, 0]);
  //     expect(board.allShipsSunk()).toBe(true);
  //   });

  //   it('returns false when some ships are still afloat', () => {
  //     const ship = createMockShip(2);
  //     ship.isSunk = jest.fn(() => false);
  //     board.placeShip(ship, [0, 0], 'horizontal');
  //     board.receiveAttack([0, 0]);
  //     expect(board.allShipsSunk()).toBe(false);
  //   });
  // });

  describe('Board reset', () => {
    it('clears the board state for a new game', () => {
      const ship = createMockShip(1);
      board.placeShip(ship, [1, 1], 'horizontal');
      board.receiveAttack([1, 1]);
      board.resetBoard();
      expect(board.allShipsSunk()).toBe(false);
      expect(board.receiveAttack([1, 1])).toBe('miss'); // if board is reset, square is empty
    });
  });

  describe('Read-only state access', () => {
    it('provides attack history without mutation', () => {
      board.receiveAttack([2, 2]);
      const history = board.getAttackHistory();
      expect(history).toContainEqual([2, 2]);
      expect(() => {
        history.push([9, 9]);
      }).not.toAffect(board.getAttackHistory());
    });

    it('provides ship placement data without allowing changes', () => {
      const ship = createMockShip(1);
      board.placeShip(ship, [4, 4], 'horizontal');
      const ships = board.getShipPlacements();
      expect(ships.some((s) => s.ship === ship)).toBe(true);
      expect(() => {
        ships.pop();
      }).not.toAffect(board.getShipPlacements());
    });
  });
});
