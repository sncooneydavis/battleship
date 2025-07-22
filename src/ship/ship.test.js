import { Ship } from './ship.js';

describe('Ship.place', () => {
  test('Happy-path \u2013 place horizontally', () => {
    const ship = new Ship('destroyer', 3);
    ship.place({ x: 2, y: 4 }, 'horizontal');
    expect(ship.isPlaced).toBe(true);
    expect(ship.orientation).toBe('horizontal');
    expect(ship.occupiedCells).toEqual(['2,4', '3,4', '4,4']);
  });

  test('Edge \u2013 rightmost legal placement', () => {
    const ship = new Ship('patrol', 2);
    ship.place({ x: 8, y: 9 }, 'horizontal');
    expect(ship.isPlaced).toBe(true);
    expect(ship.orientation).toBe('horizontal');
    expect(ship.occupiedCells).toEqual(['8,9', '9,9']);
  });

  test('Invalid \u2013 ship already placed', () => {
    const ship = new Ship('destroyer', 3);
    ship.place({ x: 2, y: 4 }, 'horizontal');
    expect(() => ship.place({ x: 0, y: 0 }, 'vertical')).toThrow(
      'SHIP_ALREADY_PLACED'
    );
  });
});

describe('Ship.rotate', () => {
  test('Happy-path', () => {
    const ship = new Ship('battleship', 4);
    ship.place({ x: 5, y: 1 }, 'horizontal');
    const cells = ship.rotate();
    expect(ship.orientation).toBe('vertical');
    expect(cells).toEqual(['5,1', '5,2', '5,3', '5,4']);
    expect(ship.occupiedCells).toEqual(cells);
  });

  test('Edge \u2013 rotate at bottom border', () => {
    const ship = new Ship('patrol', 2);
    ship.place({ x: 0, y: 8 }, 'vertical');
    const cells = ship.rotate();
    expect(ship.orientation).toBe('horizontal');
    expect(cells).toEqual(['0,8', '1,8']);
    expect(ship.occupiedCells).toEqual(cells);
  });

  test('Invalid \u2013 ship not placed', () => {
    const ship = new Ship('submarine', 3);
    expect(() => ship.rotate()).toThrow('ship is not placed');
  });
});

describe('Ship.recordHit', () => {
  test('Happy-path', () => {
    const ship = new Ship('submarine', 3);
    ship.place({ x: 3, y: 3 }, 'horizontal');
    ship.recordHit('4,3');
    expect(ship.hitCells.has('4,3')).toBe(true);
    expect(ship.isSunk).toBe(false);
  });

  test('Edge \u2013 final intact cell', () => {
    const ship = new Ship('submarine', 3);
    ship.place({ x: 3, y: 3 }, 'horizontal');
    ship.recordHit('3,3');
    ship.recordHit('4,3');
    ship.recordHit('5,3');
    expect(ship.isSunk).toBe(true);
  });

  test('Invalid \u2013 coordinate not on ship', () => {
    const ship = new Ship('submarine', 3);
    ship.place({ x: 3, y: 3 }, 'horizontal');
    expect(() => ship.recordHit('9,9')).toThrow(
      'coordinate is not part of this ship'
    );
  });
});

describe('Ship.checkIfSunk', () => {
  test('Happy-path partial hits', () => {
    const ship = new Ship('destroyer', 3);
    ship.place({ x: 1, y: 1 }, 'horizontal');
    ship.recordHit('1,1');
    expect(ship.checkIfSunk()).toBe(false);
  });

  test('Edge \u2013 ship not placed', () => {
    const ship = new Ship('destroyer', 3);
    expect(ship.checkIfSunk()).toBe(false);
  });

  test('Edge \u2013 all cells hit', () => {
    const ship = new Ship('patrol', 2);
    ship.place({ x: 0, y: 0 }, 'horizontal');
    ship.recordHit('0,0');
    ship.recordHit('1,0');
    expect(ship.checkIfSunk()).toBe(true);
  });
});

describe('Ship.getOccupiedCells', () => {
  test('Happy-path vertical placement', () => {
    const ship = new Ship('carrier', 5);
    ship.place({ x: 6, y: 0 }, 'vertical');
    expect(ship.getOccupiedCells()).toEqual([
      '6,0',
      '6,1',
      '6,2',
      '6,3',
      '6,4',
    ]);
  });

  test('Edge \u2013 not placed', () => {
    const ship = new Ship('carrier', 5);
    expect(ship.getOccupiedCells()).toEqual([]);
  });
});

describe('Ship.reset', () => {
  test('Happy-path reset', () => {
    const ship = new Ship('battleship', 4);
    ship.place({ x: 2, y: 2 }, 'horizontal');
    ship.recordHit('2,2');
    ship.reset();
    expect(ship.isPlaced).toBe(false);
    expect(ship.position).toBeNull();
    expect(ship.hitCells.size).toBe(0);
  });

  test('Edge \u2013 idempotent', () => {
    const ship = new Ship('carrier', 5);
    ship.reset();
    const snapshot = JSON.stringify(ship);
    ship.reset();
    expect(JSON.stringify(ship)).toBe(snapshot);
  });
});
