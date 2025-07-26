/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
class DragDropController {
  constructor(board, fleet) {
    this.board = board;
    this.fleet = fleet;

    this.dragState = null;
    // shipElement,
    // ship: this.fleet.ships[shipElement.id],
    // cellSize,
    // shipOffset: { x: clientOffset.x, y: clientOffset.y },
    // isValidPosition: null or bool,
    // coveredCellElements,

    this.boardElement = document.getElementById('player-board');
  }

  addEventListeners() {
    const ships = document.querySelectorAll('.ship');

    ships.forEach((shipElement) => {
      shipElement.addEventListener('dragstart', (e) => {
        const rect = shipElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        this.startDrag(shipElement, { x: offsetX, y: offsetY });
      });
    });

    this.boardElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dragState.ship.position = this.getCoordinatesOfCellOccupiedByMouse({
        x: e.clientX,
        y: e.clientY,
      });
      this.updateDragState();
    });

    this.boardElement.addEventListener('dragleave', () => {
      this.clearDragHighlights(this.dragState.coveredCellElements);
    });

    this.boardElement.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.dragState.isValidPosition) {
        this.board.markCellsOccupied(
          this.dragState.coveredCellElements,
          this.dragState.ship.id
        );

        this.dragState.ship.cellsOccupied = this.dragState.coveredCellElements;
        this.dragState.ship.isPlaced = true;
        this.snapShipInPlace();
        this.dragState = null;
      } else if (this.dragState.ship.cellsOccupied) {
        // put ship back in old position
        this.snapShipInPlace();
      } else {
        // put ship back in dock
        this.snapShipInDock(this.dragState.ship.id);
      }
    });
    this.dragState = null;
  }

  isDragging() {
    return this.dragState;
  }

  startDrag(shipElement, clientOffset) {
    const cellSize = document.querySelector('.cell').offsetHeight;
    this.dragState = {
      shipElement,
      ship: this.fleet.ships[shipElement.id],
      cellSize,
      shipOffset: { x: clientOffset.x, y: clientOffset.y },
      isValidPosition: false,
      coveredCellElements: null,
    };
  }

  getCoordinatesOfCellOccupiedByMouse(mousePosition) {
    const rect = this.boardElement.getBoundingClientRect();
    const topLeftX = Math.floor(
      (mousePosition.x - rect.left - this.dragState.shipOffset.x) /
        (this.dragState.cellSize + 4)
    );
    const topLeftY = Math.floor(
      (mousePosition.y - rect.y - this.dragState.shipOffset.y) /
        (this.dragState.cellSize + 4)
    );
    return { x: topLeftX, y: topLeftY };
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
    this.dragState.coveredCellElements = this.getAllCoveredCellElements();
    if (
      this.board.isValidPosition(
        this.dragState.ship.position.x,
        this.dragState.ship.position.y,
        this.dragState.ship.length,
        this.dragState.ship.orientation
      )
    ) {
      this.dragState.coveredCellElements.forEach((element) => {
        element.classList.add('good-drag');
      });
      this.dragState.isValidPosition = true;
    } else {
      this.dragState.coveredCellElements.forEach((element) => {
        element.classList.add('bad-drag');
      });
      this.dragState.isValidPosition = false;
    }
  }

  clearDragHighlights(previouslyCoveredCells) {
    previouslyCoveredCells.forEach((element) => {
      element.classList.remove('good-drag');
      element.classList.remove('bad-drag');
    });
    this.dragState.coveredCellElements = null;
    this.dragState.isValidPosition = false;
  }

  snapShipInPlace() {
    // Snap ship to the top-left cell
    const rect = this.boardElement.getBoundingClientRect();
    const topLeftX = this.dragState.coveredCellElements[0].offsetLeft;
    const topLeftY = this.dragState.coveredCellElements[0].offsetTop;
    this.dragState.shipElement.style.position = 'absolute';
    this.dragState.shipElement.style.left = `${topLeftX + rect.left}px`;
    this.dragState.shipElement.style.top = `${topLeftY + rect.top}px`;
    this.dragState = null;
  }

  snapShipInDock(shipId) {
    const img = document.getElementById(`${shipId}`);
    const targetDiv = document.getElementById(`${shipId}-dock`);
    targetDiv.appendChild(img);
  }
}

export { DragDropController };
