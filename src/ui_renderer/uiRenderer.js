/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

import { DragDropController } from '../drag_drop_controller/dragDropController.js';

class UIRenderer {
  constructor(playerBoard, opponentBoard, onStartCallback) {
    this.board = playerBoard;

    this.playerBoard = playerBoard;
    this.playerDragDropController = new DragDropController(playerBoard);
    this.playerShipElements = null;

    this.opponentBoard = opponentBoard;
    this.opponentDragDropController = null;
    this.opponentShipElements = null;

    this.setUp();
    this.onStartCallback = onStartCallback;
    this.startGameListeners();
  }

  setUp() {
    this.renderBoard();
    this.playerShipElements = document.querySelectorAll('.player.ship');
    this.opponentShipElements = document.querySelectorAll('.opponent.ship');

    this.playerDragDropController.setUp();

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      this.reset();
    });

    const randomizeButton = document.getElementById('randomize');
    randomizeButton.addEventListener('click', () => {
      this.reset();
      this.randomizePlacement();
      this.board.incrementPlacedCountBy = 5;
    });

    // const opponentPlayerButton = document.getElementById('opponent-player');
    // opponentPlayerButton.addEventListener('click', () => {
    //   this.appendShipsToBoard();
    //   document.getElementById('player').classList.add('hidden');
    //   this.board = this.opponentBoard;
    //   this.renderBoard();
    //   this.opponentDragDropController = new DragDropController(this.board);
    //   this.opponentDragDropController.setUp();

    //   // reset screen for opponent
    //   document.querySelector('.button-holder.place').classList.remove('hidden');
    //   document.querySelector('.button-holder.play').classList.add('hidden');
    //   this.playerShipElements.forEach((element) => {
    //     element.classList.add('hidden');
    //   });
    //   this.opponentShipElements.forEach((element) => {
    //     element.classList.remove('hidden');
    //   });
    // });
  }

  startGameListeners() {
    // start PvC game
    const computerPlayerButton = document.getElementById('opponent-computer');
    computerPlayerButton.addEventListener('click', () => {
      this.appendShipsToBoard();

      this.opponentBoard.id = 'computer';
      this.board = this.opponentBoard;
      this.renderBoard();
      this.randomizePlacement();
      document.querySelector('.drag.section').classList.add('hidden');
      const ships = document.querySelectorAll('.ship');
      ships.forEach((ship) => {
        ship.draggable = false;
      });
      this.startGame('computer');
    });

    // start PvP game
    const playButton = document.querySelector('.start-game');
    playButton.addEventListener('click', () => {
      this.appendShipsToBoard();
      document.querySelector('.drag.section').classList.add('hidden');
      document.getElementById('player').classList.remove('hidden');
      const ships = document.querySelectorAll('.ship');
      ships.forEach((ship) => {
        ship.draggable = false;
        ship.classList.add('hidden');
      });
      this.startGame('opponent');
    });
  }

  startGame(matchType) {
    this.playerDragDropController.suppressClick = true;
    if (matchType !== 'computer') {
      this.opponentDragDropController.suppressClick = true;
    }
    this.onStartCallback(matchType);
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
        row.appendChild(cell);
      }
      container.appendChild(row);
    }
    const mainContainer = document.getElementById('main-container');
    if (this.board.id === 'player') {
      mainContainer.prepend(container);
    } else {
      mainContainer.append(container);
    }
  }

  reset() {
    Object.values(this.board.ships).forEach((ship) => {
      const shipElement = document.querySelector(
        `.${this.board.id}[data-ship="${ship.id}"]`
      );
      shipElement.style.transform = 'rotate(0deg) translate(0,0)';
      shipElement.style.top = '';
      shipElement.style.left = '';
    });
    this.board.reset();
  }

  randomizePlacement() {
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
          ship.orientation = orient;
          this.board.markCellsOccupied(canOccupy, ship.id);
          if (this.board.id !== 'computer') {
            this.setRandomPlacement(
              document.querySelector(
                `.${this.board.id}[data-ship="${ship.id}"]`
              ),
              document.querySelector(
                `#${this.board.id} [data-coordinate="${x},${y}"]`
              ),
              orient
            );
          }
          placed = true;
        }
      }
    });
  }

  setRandomPlacement(shipElement, cellElement, orientation) {
    const boardRect = document
      .getElementById(this.board.id)
      .getBoundingClientRect();
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

  appendShipsToBoard() {
    const ships = document.querySelectorAll(`.${this.board.id}.ship`);
    const board = document.getElementById(`${this.board.id}`);
    ships.forEach((element) => {
      board.appendChild(element);
      const currentLeft = parseFloat(element.style.left) || 0;
      const currentTop = parseFloat(element.style.top) || 0;
      const rect = board.getBoundingClientRect();
      element.style.left = `${currentLeft - rect.left}px`;
      element.style.top = `${currentTop - rect.top}px`;
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export { UIRenderer };
