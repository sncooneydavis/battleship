/* eslint-disable import/prefer-default-export */
class GameBoard {
  width = 10;

  height = 10;

  constructor(id, ships) {
    this.id = id;
    this.ships = ships;
    this.shipPositions = new Map();
    this.guessHistory = new Set();
  }

  #withinBounds = (x, y) =>
    x >= 0 && y >= 0 && x < this.width && y < this.height;

  isShipInBoundsAndNotOverlapping = (x, y, length, orientation) => {
    const occupied = this.getOccupiedCells(x, y, length, orientation);
    // eslint-disable-next-line no-restricted-syntax
    for (const coord of occupied) {
      const [cx, cy] = coord.split(',').map(Number);

      if (!this.#withinBounds(cx, cy)) {
        return false;
      }

      if (this.shipPositions.has(coord)) {
        return false;
      }
    }

    return occupied;
  };

  // eslint-disable-next-line class-methods-use-this
  getOccupiedCells = (x, y, length, orientation) => {
    const cells = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;

      cells.push(`${cx},${cy}`);
    }

    return cells;
  };

  markCellsOccupied = (cells, shipId) => {
    // eslint-disable-next-line consistent-return
    cells.forEach((cell) => {
      const [xs, ys] = cell.split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!this.#withinBounds(x, y)) return false;
    });
    cells.forEach((cell) => {
      this.shipPositions.set(cell, shipId);
    });
    this.ships[shipId].place(cells[0], this.ships[shipId].orientation);
    return true;
  };

  clearCells = (cells, shipId) => {
    cells.forEach((cell) => {
      const [xs, ys] = cell.split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!this.#withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
      this.shipPositions.delete(cell, shipId);
    });
  };

  getCellState = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.#withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    const guessed = this.guessHistory.has(coordinate);
    const occupied = this.shipPositions.has(coordinate);
    if (guessed) return occupied ? 'hit' : 'miss';
    return occupied ? 'occupied' : 'empty';
  };

  markGuess = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.#withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    if (this.guessHistory.has(coordinate))
      throw new Error('CELL_ALREADY_GUESSED');
    this.guessHistory.add(coordinate);
  };

  hasBeenGuessed = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.#withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    return this.guessHistory.has(coordinate);
  };

  reset = () => {
    this.shipPositions = new Map();
    this.guessHistory = new Set();
    Object.values(this.ships).forEach((ship) => {
      ship.reset();
    });
  };

  // eslint-disable-next-line class-methods-use-this
  getRandomOrientation() {
    return Math.random() >= 0.5 ? 'horizontal' : 'vertical';
  }

  getRandomX() {
    return Math.floor(Math.random() * this.width) + 1;
  }

  getRandomY() {
    return Math.floor(Math.random() * this.height) + 1;
  }
}

export { GameBoard };
