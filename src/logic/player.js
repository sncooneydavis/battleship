/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
// player.js

import { v4 as uuidv4 } from 'uuid';

// Coordinate validation helpers
const isValidCoordinate = (coord) =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  coord.every((n) => Number.isInteger(n) && n >= 0 && n < 10);

const assertValidCoordinate = (coord) => {
  if (!Array.isArray(coord) || coord.length !== 2) {
    throw new Error('Invalid coordinate: must be a [x, y] pair');
  }
  if (!isValidCoordinate(coord)) {
    throw new Error('Coordinate out of bounds');
  }
};

// Base Player factory (not exported)
const createBasePlayer = ({ id, name, type, gameboard }) => ({
  id,
  name,
  type,
  gameboard,
  submitAttack(coord) {
    assertValidCoordinate(coord);
    return this.gameboard.receiveAttack(coord);
  },
});

// ComputerPlayer strategy (default: random untried move)
const createDefaultStrategy = (gameboard) => () => {
  const history = gameboard.getAttackHistory();
  const tried = new Set(history.map(([x, y]) => `${x},${y}`));
  const available = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const key = `${x},${y}`;
      if (!tried.has(key)) {
        available.push([x, y]);
      }
    }
  }

  if (available.length === 0) {
    throw new Error('No valid moves remaining');
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

// PlayerFactory (singleton prevention via closure)
const PlayerFactory = (() => {
  return {
    createPlayers({
      humanName = 'Human',
      computerName = 'Computer',
      gameboardFactory,
    }) {
      const human = {
        ...createBasePlayer({
          id: uuidv4(),
          name: humanName,
          type: 'human',
          gameboard: gameboardFactory(),
        }),
      };

      const computerGameboard = gameboardFactory();
      const computer = {
        ...createBasePlayer({
          id: uuidv4(),
          name: computerName,
          type: 'computer',
          gameboard: computerGameboard,
        }),
        getNextMove: createDefaultStrategy(computerGameboard),
      };

      return [human, computer];
    },
  };
})();

export { PlayerFactory };
