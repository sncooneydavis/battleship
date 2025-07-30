/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
class UIRenderer {
  constructor(board) {
    this.board = board;
  }

  setUp() {
    this.renderBoard();
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      this.reset();
    });

    const randomizeButton = document.getElementById('randomize');
    randomizeButton.addEventListener('click', () => {
      this.reset();
      Object.values(this.board.ships).forEach((ship) => {
        let placed = false;
        let x;
        let y;
        let orient;
        while (!placed) {
          x = this.board.getRandomX();
          y = this.board.getRandomY();
          orient = this.board.getRandomOrientation();
          const canOccupy = this.board.isShipInBoundsAndNotOverlapping(
            x,
            y,
            ship.length,
            orient
          );
          if (canOccupy) {
            console.log('shipid', ship.id);
            console.log('x,y', { x, y });
            ship.orientation = orient;
            this.board.markCellsOccupied(canOccupy, ship.id);
            this.setRandomPlacement(
              document.getElementById(`${ship.id}`),
              document.querySelector(`[data-coordinate="${x},${y}"]`),
              orient
            );
            placed = true;
          }
        }
      });
    });
  }

  renderBoard() {
    const container = document.createElement('div');
    container.id = this.board.id;
    container.classList.add('board');
    for (let y = 0; y < this.board.height; y += 1) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < this.board.width; x += 1) {
        const cell = document.createElement('div');
        const coord = `${x},${y}`;
        cell.className = 'cell';
        cell.dataset.coordinate = coord;
        if (this.board.shipPositions.has(coord)) {
          cell.classList.add('ship');
        }
        row.appendChild(cell);
      }
      container.appendChild(row);
    }
    const mainContainer = document.getElementById('main-container');
    mainContainer.prepend(container);
  }

  reset() {
    Object.values(this.board.ships).forEach((ship) => {
      const shipElement = document.getElementById(ship.id);
      shipElement.style.transform = 'rotate(0deg) translate(0,0)';
      shipElement.style.top = '';
      shipElement.style.left = '';
    });
    this.board.reset();
  }

  setRandomPlacement(shipElement, cellElement, orientation) {
    const boardRect = document.querySelector('.board').getBoundingClientRect();
    const cellX = cellElement.offsetLeft;
    const cellY = cellElement.offsetTop;

    const cellRect = cellElement.getBoundingClientRect();

    shipElement.style.position = 'absolute';
    shipElement.style.left = `${cellX + boardRect.left}px`;
    shipElement.style.top = `${cellY + boardRect.top}px`;

    if (orientation === 'horizontal') {
      shipElement.style.transform = `rotate(-90deg) translate(-${cellRect.height}px, 0)`;
    }
  }

  showHit(coordinate, boardId) {
    return new Promise((resolve) => {
      const cell = document
        .getElementById(boardId)
        .querySelector(`.cell[data-coordinate="${coordinate}"]`);
      if (cell) cell.classList.add('hit');
      this.eventBus.emit({
        type: 'VISUAL_FEEDBACK',
        feedbackType: 'HIT_EXPLOSION',
        location: coordinate,
        duration: 1000,
        timestamp: Date.now(),
      });
      resolve();
    });
  }

  showMiss(coordinate, boardId) {
    return new Promise((resolve) => {
      const cell = document
        .getElementById(boardId)
        .querySelector(`.cell[data-coordinate="${coordinate}"]`);
      if (cell) cell.classList.add('miss');
      this.eventBus.emit({
        type: 'VISUAL_FEEDBACK',
        feedbackType: 'MISS_SPLASH',
        location: coordinate,
        duration: 1000,
        timestamp: Date.now(),
      });
      resolve();
    });
  }

  toggleSetupUI(visible) {
    const panel = document.getElementById('setup-panel');
    if (!panel) return;
    if (visible) panel.classList.remove('hidden');
    else panel.classList.add('hidden');
  }

  showEndgame(winner) {
    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.textContent = `${winner} wins!`;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { UIRenderer };
