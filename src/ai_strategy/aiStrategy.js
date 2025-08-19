/* eslint-disable no-console */
class AIStrategy {
  constructor(playerBoard) {
    this.hitQueue = [];
    this.initialHit = null;
    this.axis = null;
    this.increasingMoveCount = 1;
    this.decreasingMoveCount = 1;
    this.increasingEndFound = false;
    this.decreasingEndFound = false;

    this.board = playerBoard;
  }

  // eslint-disable-next-line consistent-return
  getNextMove() {
    // If both ends found, reset
    if (this.increasingEndFound && this.decreasingEndFound) {
      this.resetNextMoveState();
      console.log('cleared');
    }

    // If no moves left, reset
    if (this.hitQueue.length === 0) {
      this.resetNextMoveState();
    }

    // Prioritize queued targets from previous hits
    if (this.hitQueue.length !== 0) {
      const coord = this.hitQueue.shift();
      this.board.markGuess(coord);

      console.log('coord from queue just selected', coord);
      const [nx, ny] = coord.split(',');
      const newX = Number(nx);
      const newY = Number(ny);
      const [ix, iy] = this.initialHit.split(',');
      const initialX = Number(ix);
      const initialY = Number(iy);
      // If unsuccessful hit on directionally targeted ship
      // Check if coordinate is endpoint
      if (!this.board.isHitSuccessful(coord) && this.axis) {
        if (newX > initialX || newY > initialY) {
          this.increasingEndFound = true;
          console.log('increasing end found');
        }
        if (newX < initialX || newY < initialY) {
          this.decreasingEndFound = true;
          console.log('decreasing end found');
        }
      }

      // If successful hit...
      if (this.board.isHitSuccessful(coord)) {
        // ...on a ship hit once
        if (!this.axis) {
          this.hitQueue = [];
          // hit count must move one up in the direction hit
          if (newX > initialX || newY > initialY) {
            this.increasingMoveCount += 1;
            console.log('increasing move count incremented');
          }
          if (newX < initialX || newY < initialY) {
            this.decreasingMoveCount += 1;
            console.log('decreasing move count incremented');
          }
        }
        // ...on a ship hit any number of times
        this.fillGuessQueue(coord);
      }
      return coord;
    }

    // make guess if ship not actively being targeted
    if (this.initialHit === null) {
      const limit = this.board.width * this.board.height;
      for (let i = 0; i < limit; i += 1) {
        const x = Math.floor(Math.random() * this.board.width);
        const y = Math.floor(Math.random() * this.board.height);
        const coord = `${x},${y}`;
        // eslint-disable-next-line no-continue
        if (!this.board.markGuess(coord)) continue;
        const wasHit = this.board.isHitSuccessful(coord);
        if (wasHit) this.fillInitialGuessQueue(coord);
        return coord;
      }
      // Fallback: linear scan for any remaining unguessed cell
      for (let x = 0; x < this.board.width; x += 1) {
        for (let y = 0; y < this.board.height; y += 1) {
          const coord = `${x},${y}`;
          if (this.board.markGuess(coord)) return coord;
        }
      }
    }
  }

  fillInitialGuessQueue(coordinate) {
    // when no actively targeted ship
    // get all four surrounding coordinates
    this.initialHit = coordinate;
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
      const nCoord = `${nx},${ny}`;
      if (
        this.board.isWithinBounds(nx, ny) &&
        !this.board.guessHistory.has(nCoord)
      ) {
        this.hitQueue.push(nCoord);
      }
    });
    console.log('hit queue initial', this.hitQueue);
  }

  fillGuessQueue(coordinate) {
    console.log('hit queue before fill', this.hitQueue);
    const [nx, ny] = coordinate.split(',');
    const newX = Number(nx);
    const newY = Number(ny);
    const [ix, iy] = this.initialHit.split(',');
    const initialX = Number(ix);
    const initialY = Number(iy);
    if (newX === initialX) {
      this.axis = 'vertical';
      this.getVerticalMoves(initialX, initialY);
    } else if (newY === initialY) {
      this.axis = 'horizontal';
      this.getHorizontalMoves(initialX, initialY);
    }
    console.log('axis', this.axis);
    console.log('hit queue after fill', this.hitQueue);
  }

  // ISSUE
  getVerticalMoves(x, y) {
    if (
      this.board.isWithinBounds(x, y - this.decreasingMoveCount) &&
      !this.board.guessHistory.has(`${x},${y - this.decreasingMoveCount}`) &&
      this.decreasingEndFound === false
    ) {
      const proposedXDownwards = `${x},${y - this.decreasingMoveCount}`;
      this.hitQueue.push(proposedXDownwards);
      this.decreasingMoveCount += 1;
      console.log('decreasing move count', this.decreasingMoveCount);
    }
    if (
      this.board.isWithinBounds(x, y + this.increasingMoveCount) &&
      !this.board.guessHistory.has(`${x},${y + this.increasingMoveCount}`) &&
      this.increasingEndFound === false
    ) {
      const proposedXUpwards = `${x},${y + this.increasingMoveCount}`;
      this.hitQueue.push(proposedXUpwards);
      this.increasingMoveCount += 1;
      console.log('increasing move count', this.increasingMoveCount);
    }
  }

  getHorizontalMoves(initialX, initialY) {
    if (
      this.board.isWithinBounds(
        initialX - this.decreasingMoveCount,
        initialY
      ) &&
      !this.board.guessHistory.has(
        `${initialX - this.decreasingMoveCount},${initialY}`
      ) &&
      this.decreasingEndFound === false
    ) {
      const proposedYBackwards = `${initialX - this.decreasingMoveCount},${initialY}`;
      this.hitQueue.push(proposedYBackwards);
      this.decreasingMoveCount += 1;
      console.log('decreasing move count', this.decreasingMoveCount);
    }
    if (
      this.board.isWithinBounds(
        initialX + this.increasingMoveCount,
        initialY
      ) &&
      !this.board.guessHistory.has(
        `${initialX + this.increasingMoveCount},${initialY}`
      ) &&
      this.increasingEndFound === false
    ) {
      const proposedYForwards = `${initialX + this.increasingMoveCount},${initialY}`;
      this.hitQueue.push(proposedYForwards);
      this.increasingMoveCount += 1;
      console.log('increasing move count', this.increasingMoveCount);
    }
  }

  resetNextMoveState() {
    this.hitQueue = [];
    this.initialHit = null;
    this.axis = null;
    this.increasingMoveCount = 1;
    this.decreasingMoveCount = 1;
    this.increasingEndFound = false;
    this.decreasingEndFound = false;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { AIStrategy };
