/* eslint-disable no-plusplus */

import { createShip } from '../../logic/ship.js';

describe('createShip', () => {
  let ship;

  beforeEach(() => {
    ship = createShip(3); // Ship of length 3
  });

  it('initializes with correct length and zero hits', () => {
    expect(ship.getLength()).toBe(3);
    expect(ship.isSunk()).toBe(false);
  });

  it('registers hits correctly', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  it('does not overcount hits', () => {
    for (let i = 0; i < 5; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  });
});
