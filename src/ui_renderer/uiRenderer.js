/* eslint-disable class-methods-use-this */
class UIRenderer {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  renderBoard(board, elementId) {
    const container = document.createElement('div');
    container.id = elementId;
    container.classList.add('board');
    for (let y = 0; y < board.height; y += 1) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < board.width; x += 1) {
        const cell = document.createElement('div');
        const coord = `${x},${y}`;
        cell.className = 'cell';
        cell.dataset.coordinate = coord;
        if (board.shipPositions.has(coord)) {
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

  highlightCells(cells, valid) {
    cells.forEach((c) => {
      const cell = document.querySelector(`.cell[data-coordinate="${c}"]`);
      if (cell)
        cell.classList.add(valid ? 'highlight-valid' : 'highlight-invalid');
    });
  }

  clearHighlights() {
    document
      .querySelectorAll('.highlight-valid, .highlight-invalid')
      .forEach((el) => {
        el.classList.remove('highlight-valid', 'highlight-invalid');
      });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { UIRenderer };
