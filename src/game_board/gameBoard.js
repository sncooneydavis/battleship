/* eslint-disable import/prefer-default-export */
class GameBoard {
  width = 10;

  height = 10;

  constructor() {
    this.shipPositions = new Map();
    this.guessHistory = new Set();
  }

  withinBounds = (x, y) =>
    x >= 0 && y >= 0 && x < this.width && y < this.height;

  isValidPosition = (x, y, length, orientation) => {
    if (!this.withinBounds(x, y)) return false;
    if (orientation === 'horizontal') {
      return x + length <= this.width;
    }
    if (orientation === 'vertical') {
      return y + length <= this.height;
    }
    return false;
  };

  getOccupiedCells = (x, y, length, orientation) => {
    if (!this.isValidPosition(x, y, length, orientation)) return [];
    const cells = [];
    for (let i = 0; i < length; i += 1) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;
      cells.push(`${cx},${cy}`);
    }
    return cells;
  };

  markCellsOccupied = (cells, shipId) => {
    cells.forEach((cell) => {
      const [xs, ys] = cell.split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!this.withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
      if (this.shipPositions.has(cell)) throw new Error('SHIP_OVERLAP');
    });
    cells.forEach((cell) => {
      this.shipPositions.set(cell, shipId);
    });
  };

  clearCells = (cells) => {
    cells.forEach((cell) => {
      const [xs, ys] = cell.split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!this.withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
      this.shipPositions.delete(cell);
    });
  };

  getCellState = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    const guessed = this.guessHistory.has(coordinate);
    const occupied = this.shipPositions.has(coordinate);
    if (guessed) return occupied ? 'hit' : 'miss';
    return occupied ? 'occupied' : 'empty';
  };

  markGuess = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    if (this.guessHistory.has(coordinate))
      throw new Error('CELL_ALREADY_GUESSED');
    this.guessHistory.add(coordinate);
  };

  hasBeenGuessed = (coordinate) => {
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    if (!this.withinBounds(x, y)) throw new Error('INVALID_COORDINATE');
    return this.guessHistory.has(coordinate);
  };

  reset = () => {
    this.shipPositions = new Map();
    this.guessHistory = new Set();
  };
}

export { GameBoard };
