/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
class DragDropController {
  constructor(board) {
    this.board = board;

    this.dragState = null;
    this.boardElement = null;
  }

  addEventListeners() {
    const ships = document.querySelectorAll('.ship');
    const cells = document.querySelectorAll('.cell');
    this.boardElement = document.querySelector('.board');

    ships.forEach((shipElement) => {
      shipElement.addEventListener('dragstart', (e) => {
        const rect = shipElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        this.startDrag(shipElement, { x: offsetX, y: offsetY });
      });
    });

    cells.forEach((cell) => {
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dragState.ship.position = this.getCoordinatesOfCellOccupiedByMouse(
          {
            x: e.clientX,
            y: e.clientY,
          }
        );
        console.log(this.dragState.ship.position);
        this.updateDragState();
      });
    });
    this.boardElement.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.dragState.isValidPosition) {
        const cellsToUnmark = this.dragState.ship.cellsOccupied;
        if (cellsToUnmark.length > 0) {
          this.board.clearCells(cellsToUnmark);
        }
        this.board.markCellsOccupied(
          this.board.getOccupiedCells(
            this.dragState.ship.position.x,
            this.dragState.ship.position.y,
            this.dragState.ship.length,
            this.dragState.ship.orientation
          ),
          this.dragState.ship.id
        );
        this.dragState.ship.cellsOccupied =
          this.dragState.coveredCellElements;
        this.dragState.ship.isPlaced = true;
        this.snapShipInPlace();
      } else if (this.dragState.ship.cellsOccupied.length > 0) {
        // put ship back in old position
        this.snapShipInPlace();
      } else {
        // put ship back in dock
        this.snapShipInDock(this.dragState.ship.id);
      }
      this.resetDragState();
    });
  }

  startDrag(shipElement, clientOffset) {
    const cellSize = document.querySelector('.cell').offsetHeight;
    this.dragState = {
      shipElement,
      ship: this.board.ships[shipElement.id],
      cellSize,
      shipOffset: { x: clientOffset.x, y: clientOffset.y },
      isValidPosition: false,
      coveredCellElements: null,
    };
  }

  getCoordinatesOfCellOccupiedByMouse(mousePosition) {
    const rect = this.boardElement.getBoundingClientRect();
    const x = Math.floor(
      (mousePosition.x - rect.left - this.dragState.shipOffset.x) /
        this.dragState.cellSize
    );
    const y = Math.floor(
      (mousePosition.y - rect.top - this.dragState.shipOffset.y) /
        this.dragState.cellSize
    );
    const clampedX = Math.max(0, Math.min(this.board.width - 1, x));
    const clampedY = Math.max(0, Math.min(this.board.height - 1, y));

    return { x: clampedX, y: clampedY };
  }

  getAllCoveredCellElements() {
    const cellCoordinates = this.board.getOccupiedCells(
      this.dragState.ship.position.x,
      this.dragState.ship.position.y,
      this.dragState.ship.length,
      this.dragState.ship.orientation
    );

    const occupiedElements = [];

    cellCoordinates.forEach((coordinate) => {
      occupiedElements.push(
        document.querySelector(`[data-coordinate="${coordinate}"]`)
      );
    });

    return occupiedElements;
  }

  updateDragState() {
    const allCells = this.boardElement.querySelectorAll('.cell');
    allCells.forEach((element) => {
      element.classList.remove('good-drag');
      element.classList.remove('bad-drag');
    });
    this.dragState.coveredCellElements = this.getAllCoveredCellElements();
    if (
      this.board.isShipInBoundsAndNotOverlapping(
        this.dragState.ship.position.x,
        this.dragState.ship.position.y,
        this.dragState.ship.length,
        this.dragState.ship.orientation
      )
    ) {
      this.dragState.coveredCellElements.forEach((element) => {
        if (element) {
          element.classList.add('good-drag');
        }
      });
      this.dragState.isValidPosition = true;
    } else {
      this.dragState.coveredCellElements.forEach((element) => {
        if (element) {
          element.classList.add('bad-drag');
        }
      });
      this.dragState.isValidPosition = false;
    }
  }

  resetDragState() {
    const allCells = this.boardElement.querySelectorAll('.cell');
    allCells.forEach((element) => {
      element.classList.remove('good-drag');
      element.classList.remove('bad-drag');
    });
    this.dragState = null;
  }

  snapShipInPlace() {
    // Snap ship to the top-left cell
    const rect = this.boardElement.getBoundingClientRect();
    const topLeftX = this.dragState.coveredCellElements[0].offsetLeft;
    const topLeftY = this.dragState.coveredCellElements[0].offsetTop;
    this.dragState.shipElement.style.position = 'absolute';
    this.dragState.shipElement.style.left = `${topLeftX + rect.left}px`;
    this.dragState.shipElement.style.top = `${topLeftY + rect.top}px`;
  }

  snapShipInDock(shipId) {
    const img = document.getElementById(`${shipId}`);
    const targetDiv = document.getElementById(`${shipId}-dock`);
    targetDiv.appendChild(img);
  }
}

export { DragDropController };
