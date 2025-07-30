/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
class DragDropController {
  constructor(board) {
    this.board = board;

    this.dragState = null;
    this.boardElement = null;
    this.suppressClick = true;
  }

  setUp() {
    const ships = document.querySelectorAll('.ship');
    const cells = document.querySelectorAll('.cell');
    this.boardElement = document.querySelector('.board');

    ships.forEach((shipElement) => {
      shipElement.addEventListener('dragstart', (e) => {
        this.suppressClick = true;
        document.querySelector('.drag.instructions').classList.add('hidden');

        const rect = shipElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        this.startDrag(shipElement, { x: offsetX, y: offsetY });
      });

      // click to rotate if ship is placed on the board
      // and if ship's rotation will not place it off the board
      shipElement.addEventListener('click', () => {
        if (this.suppressClick) {
          return;
        }
        const ship = this.board.ships[shipElement.id];
        if (ship.position) {
          this.rotateShip(shipElement, ship);
        }
      });
    });

    cells.forEach((cell) => {
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.removeHighlights();
        this.updateDragState(e);
      });
    });

    this.boardElement.addEventListener('drop', (e) => {
      e.preventDefault();
      document.querySelector('.rotate.instructions').classList.remove('hidden');
      if (this.dragState.isValidPosition) {
        this.board.markCellsOccupied(
          this.board.getOccupiedCells(
            this.dragState.ship.position.x,
            this.dragState.ship.position.y,
            this.dragState.ship.length,
            this.dragState.ship.orientation
          ),
          this.dragState.ship.id
        );
        this.snapShipInPlace();
      }
      this.dragState = null;
      this.removeAllHighlights();
      this.suppressClick = false;
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      const boardRect = this.boardElement.getBoundingClientRect();
      const isInsideBoard =
        e.clientX >= boardRect.left &&
        e.clientX <= boardRect.right &&
        e.clientY >= boardRect.top &&
        e.clientY <= boardRect.bottom;
      if (!isInsideBoard) {
        this.removeAllHighlights();
      }
      
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
    this.dragState.ship.position = null;
    const cellsToUnmark = this.dragState.ship.cellsOccupied;
    if (cellsToUnmark.length > 0) {
      this.board.clearCells(cellsToUnmark);
    }
    this.dragState.ship.cellsOccupied = [];
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

  removeHighlights() {
    console.log(this.dragState)
    if (!this.dragState || !this.dragState.coveredCellElements) return;

    if (this.dragState.coveredCellElements) {
      this.dragState.coveredCellElements.forEach((element) => {
        if (element) {
          element.classList.remove('good-drag');
          element.classList.remove('bad-drag');
        }
      });
    }
  }

  removeAllHighlights() {
    const allCells = document.querySelectorAll('.cell');
    if (!allCells) return;
    allCells.forEach((cell) => {
      if (cell) {
        cell.classList.remove('good-drag');
        cell.classList.remove('bad-drag');
      }
    });
  }

  updateDragState(e) {
    this.dragState.ship.position = this.getCoordinatesOfCellOccupiedByMouse({
      x: e.clientX,
      y: e.clientY,
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

  snapShipInPlace() {
    // Snap ship to the top-left cell
    const rect = this.boardElement.getBoundingClientRect();
    const topLeftX = this.dragState.coveredCellElements[0].offsetLeft;
    const topLeftY = this.dragState.coveredCellElements[0].offsetTop;
    this.dragState.shipElement.style.position = 'absolute';
    this.dragState.shipElement.style.left = `${topLeftX + rect.left}px`;
    this.dragState.shipElement.style.top = `${topLeftY + rect.top}px`;
  }

  rotateShip(shipElement, ship) {
    let newOrientation;
    if (ship.orientation === 'vertical') {
      newOrientation = 'horizontal';
    } else newOrientation = 'vertical';
    const oldCells = ship.cellsOccupied;
    this.board.clearCells(oldCells);
    if (
      this.board.isShipInBoundsAndNotOverlapping(
        ship.position.x,
        ship.position.y,
        ship.length,
        newOrientation
      )
    ) {
      this.board.markCellsOccupied(ship.rotate(), ship.id);
      if (ship.orientation === 'vertical') {
        shipElement.style.transform = 'rotate(0deg) translate(0,0)';
      } else {
        const cellSize = document.querySelector('.cell').offsetHeight;
        shipElement.style.transform = `rotate(-90deg) translate(-${cellSize}px, 0)`;
      }
    } else {
      this.board.markCellsOccupied(oldCells, ship.id);
    }
  }
}

export { DragDropController };
