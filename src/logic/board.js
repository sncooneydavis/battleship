/* eslint-disable no-restricted-syntax */
const createGameboard = () => {
  const boardSize = 10;
  let ships = [];
  let attacks = [];

  const isInBounds = ([x, y]) =>
    x >= 0 && y >= 0 && x < boardSize && y < boardSize;

  const isOccupied = (x, y) => {
    return ships.some(({ coordinates }) =>
      coordinates.some(([cx, cy]) => cx === x && cy === y)
    );
  };

  const getCoordinates = ([x, y], length, orientation) => {
    return Array.from({ length }, (_, i) => {
      return orientation === 'horizontal' ? [x + i, y] : [x, y + i];
    });
  };

  const placeShip = (ship, startCoord, orientation) => {
    const length = ship.getLength();
    const coords = getCoordinates(startCoord, length, orientation);

    if (coords.some((coord) => !isInBounds(coord) || isOccupied(...coord))) {
      return false;
    }

    ships.push({ ship, coordinates: coords });
    return true;
  };

  const receiveAttack = ([x, y]) => {
    if (attacks.some(([ax, ay]) => ax === x && ay === y)) {
      return 'already attacked';
    }

    attacks.push([x, y]);

    for (const { ship, coordinates } of ships) {
      for (const [cx, cy] of coordinates) {
        if (cx === x && cy === y) {
          ship.hit();
          return ship.isSunk() ? 'sunk' : 'hit';
        }
      }
    }

    return 'miss';
  };

  const allShipsSunk = () => {
    return ships.length > 0 && ships.every(({ ship }) => ship.isSunk());
  };

  const resetBoard = () => {
    ships = [];
    attacks = [];
  };

  const getAttackHistory = () => {
    return attacks.map((coord) => [...coord]);
  };

  const getShipPlacements = () => {
    return ships.map((entry) => ({
      ...entry,
      coordinates: entry.coordinates.map((c) => [...c]),
    }));
  };

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    resetBoard,
    getAttackHistory,
    getShipPlacements,
  };
};

export default createGameboard;
