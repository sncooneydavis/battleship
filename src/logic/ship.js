function createShip(length) {
  let hits = 0;

  return {
    getLength: () => length,
    hit: () => {
      // eslint-disable-next-line no-plusplus
      hits++;
    },
    isSunk: () => hits >= length,
  };
}

module.export = createShip();
