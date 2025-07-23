class AIStrategy {
  constructor() {
    this.mode = 'random';
    this.lastHit = null;
    this.hitQueue = [];
    this.attemptedCells = new Set();
  }

  getNextMove(board) {
    // Prioritize queued targets from previous hits
    while (this.hitQueue.length) {
      const coord = this.hitQueue.shift();
      if (!board.hasBeenGuessed(coord) && !this.attemptedCells.has(coord)) {
        this.attemptedCells.add(coord);
        return coord;
      }
    }

    // Fallback to searching entire board
    for (let x = 0; x < board.width; x += 1) {
      for (let y = 0; y < board.height; y += 1) {
        const coord = `${x},${y}`;
        if (!board.hasBeenGuessed(coord) && !this.attemptedCells.has(coord)) {
          this.attemptedCells.add(coord);
          return coord;
        }
      }
    }

    throw new Error('NO_VALID_MOVES');
  }

  recordResult(coordinate, result, board) {
    // store board to evaluate neighbors when hit
    this.lastBoard = board || this.lastBoard;
    if (result.hit) {
      this.mode = 'hunting';
      this.lastHit = coordinate;
      if (this.lastBoard) {
        const [xs, ys] = coordinate.split(',');
        const x = Number(xs);
        const y = Number(ys);
        const deltas = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];
        deltas.forEach(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < this.lastBoard.width &&
            ny < this.lastBoard.height
          ) {
            const nCoord = `${nx},${ny}`;
            if (!this.attemptedCells.has(nCoord)) {
              this.hitQueue.push(nCoord);
            }
          }
        });
      }
    } else if (this.hitQueue.length === 0) {
      this.mode = 'random';
      this.lastHit = null;
    }
  }

  reset() {
    this.mode = 'random';
    this.lastHit = null;
    this.hitQueue = [];
    this.attemptedCells = new Set();
    this.lastBoard = null;
  }

  getCurrentMode() {
    return this.mode;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { AIStrategy };
