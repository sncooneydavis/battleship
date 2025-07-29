/* eslint-disable class-methods-use-this */
class UIRenderer {
  constructor(board) {
    this.board = board;
  }

  setUp() {
    this.renderBoard();
    console.log('ok')
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      Object.values(this.board.ships).forEach((ship) => {
        const shipElement = document.getElementById(ship.id);
        shipElement.style.transform = 'rotate(0deg) translate(0,0)';
        shipElement.style.top = '';
        shipElement.style.left = '';
      });
      this.board.reset();
    });
  }

  renderBoard() {
    const container = document.createElement('div');
    console.log(container)
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

  updateMessage({ text }) {
    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.textContent = text;
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
