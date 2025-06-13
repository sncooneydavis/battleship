/* eslint-disable no-plusplus */

import { createShip } from '../logic/ship.js';

// SCS
describe('createShip', () => {
  let ship;

  beforeEach(() => {
    ship = createShip(3); // Ship of length 3
  });

  it('initializes with correct length and zero hits', () => {
    expect(ship.getLength()).toBe(3);
    expect(ship.isSunk()).toBe(false);
  });

  it('registers hits correctly and reports isSunk', () => {
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

// SNC
// describe('create ship', () => {
//   let ship;
//   beforeEach(() => {
//     ship = createShip(3);
//   });

//   it('is initialized with a length and no hits', () => {
//     expect(ship.length).toBe(3);
//     expect(ship.isSunk).toBe(false);
//     expect(ship.hitCount).toBe(0);
//   });

//   it('records hits and is sunk when hits = length', () => {
//     ship.hit();
//     expect(ship.hitCount).toBe(1);
//     ship.hit();
//     ship.hit();
//     expect(ship.hitCount).toBe(3);
//     expect(ship.isSunk).toBe(true);
//   });

//   it('only counts hits before being sunk', () => {
//     ship.hit();
//     ship.hit();
//     ship.hit();
//     ship.hit();
//     expect(ship.hitCount).toBe(3);
//   });
// });
