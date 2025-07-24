/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
class DragDropController {
  constructor(eventBus) {
    this.dragState = null;
    this.eventBus = eventBus;
  }

  addEventListeners() {
    const ships = document.querySelectorAll('.player.ship');
    const cells = document.querySelectorAll('.cell');

    ships.forEach((ship) => {
      ship.addEventListener('dragstart', (e) => {
        this.startDrag(ship.id, { x: e.clientX, y: e.clientY });
      });
    });

    cells.forEach((cell) => {
      cell.addEventListener('dragover', (e) => {
        e.preventDefault(); // Required to allow drop
        cell.classList.add('dragging');
      });

      cell.addEventListener('dragleave', (e) => {
        e.preventDefault(); // Required to allow drop
        cell.classList.remove('dragging');
      });

      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        const shipId = e.dataTransfer.getData('text/plain');
        const ship = document.getElementById(shipId);

        // Prevent multiple ships in one cell
        if (cell.children.length === 0) {
          cell.appendChild(ship);
        }
      });
    });
  }

  isDragging() {
    return this.dragState === true;
  }

  startDrag(shipId, mousePosition) {
    this.dragState = {
      shipId,
      ghostPosition: { x: mousePosition.x, y: mousePosition.y },
      validPlacement: false,
      affectedCells: [],
    };
    this.eventBus.emit('DRAG_STARTED', {
      type: 'DRAG_STARTED',
      shipId,
      startPosition: { x: mousePosition.x, y: mousePosition.y },
      timestamp: Date.now(),
    });
  }

  updateDragPosition(mousePosition, board) {
    this.dragState.ghostPosition = { x: mousePosition.x, y: mousePosition.y };

    if (board && typeof board.isValidPosition === 'function') {
      // Use minimal check: treat ship as length 1 horizontal for preview validity
      this.dragState.validPlacement = board.isValidPosition(
        mousePosition.x,
        mousePosition.y,
        1,
        'horizontal'
      );
      this.dragState.affectedCells = this.dragState.validPlacement
        ? board.getOccupiedCells(
            mousePosition.x,
            mousePosition.y,
            1,
            'horizontal'
          )
        : [];
    } else {
      this.dragState.validPlacement = true;
      this.dragState.affectedCells = [];
    }

    this.eventBus.emit('DRAG_UPDATED', {
      type: 'DRAG_UPDATED',
      shipId: this.dragState.shipId,
      ghostPosition: this.dragState.ghostPosition,
      valid: this.dragState.validPlacement,
      timestamp: Date.now(),
    });
  }

  canDropAt(x, y) {
    const { ghostPosition, validPlacement } = this.dragState;
    return validPlacement && ghostPosition.x === x && ghostPosition.y === y;
  }

  completeDrop() {
    if (!this.dragState.validPlacement) throw new Error('DROP_INVALID');
    const { shipId, ghostPosition } = this.dragState;
    this.dragState = null;
    return {
      shipId,
      position: { ...ghostPosition },
      orientation: 'horizontal',
    };
  }

  cancelDrag() {
    const { shipId } = this.dragState;
    this.dragState = null;
    this.eventBus.emit('DRAG_CANCELLED', {
      type: 'DRAG_CANCELLED',
      shipId,
      timestamp: Date.now(),
    });
  }
}

export { DragDropController };
