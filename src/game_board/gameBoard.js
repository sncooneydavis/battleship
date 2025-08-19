/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
class GameBoard {
  width = 10;

  height = 10;

  #placedCount = 0;

  constructor(id, ships) {
    this.id = id;
    this.ships = ships;
    this.shipPositions = new Map();
    this.guessHistory = new Set();
  }

  /**
   * @param {number} value
   */
  set incrementPlacedCountBy(value) {
    this.#placedCount += value;
    if (this.#placedCount === 5) {
      const placeElement = document.querySelector('.button-holder.place');
      const playElement = document.querySelector('.button-holder.play');
      if (this.id === 'player') {
        placeElement.classList.toggle('hidden');
        playElement.classList.toggle('hidden');
      } else {
        document.querySelector('.start-game').classList.remove('hidden');
      }
    }
  }

  /**
   * @param {number} value
   */
  set decrementPlacedValueBy(value) {
    this.#placedCount -= value;
    document.querySelector('.button-holder.place').classList.remove('hidden');
    if (this.id === 'player') {
      document.querySelector('.button-holder.play').classList.add('hidden');
    } else {
      document.querySelector('.start-game').classList.add('hidden');
    }
  }

  isWithinBounds = (x, y) =>
    x >= 0 && y >= 0 && x < this.width && y < this.height;

  isOverlapping = (coord) => this.shipPositions.has(coord);

  isShipInBoundsAndNotOverlapping = (x, y, length, orientation) => {
    const occupied = this.getOccupiedCells(x, y, length, orientation);
    // eslint-disable-next-line no-restricted-syntax
    for (const coord of occupied) {
      const [cx, cy] = coord.split(',').map(Number);

      if (!this.isWithinBounds(cx, cy)) {
        return false;
      }

      if (this.isOverlapping(coord)) {
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
      if (!this.isWithinBounds(x, y)) return false;
    });
    cells.forEach((cell) => {
      this.shipPositions.set(cell, shipId);
    });
    this.ships[shipId].place(cells[0], this.ships[shipId].orientation);
    return true;
  };

  clearCells = (cells, shipId) => {
    cells.forEach((cell) => {
      this.shipPositions.delete(cell, shipId);
    });
  };

  markGuess = (coordinate) => {
    if (this.guessHistory.has(coordinate)) {
      return false;
    }
    this.guessHistory.add(coordinate);
    return true;
  };

  isHitSuccessful(coordinate) {
    return this.shipPositions.has(coordinate);
  }

  areAllShipsSunk() {
    return Object.values(this.ships).every((s) => s.isSunk);
  }

  reset = () => {
    this.shipPositions = new Map();
    this.guessHistory = new Set();
    this.decrementPlacedValueBy = this.#placedCount;
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
