/* eslint-disable no-plusplus */

// logic/ship.js

function createShip(length) {
  let hits = 0;

  return {
    getLength: () => length,
    hit: () => {
      if (hits < length) hits++;
    },
    isSunk: () => hits >= length,
  };
}

export default createShip;
