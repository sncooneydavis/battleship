/* eslint-disable no-restricted-syntax */
import { EventEmitter } from 'node:events';
import { GameBoard } from '../game_board/gameBoard.js';

class Fleet {
  constructor(
    playerId,
    board = new GameBoard(),
    ships = {},
    emitter = new EventEmitter()
  ) {
    this.playerId = playerId;
    this.board = board;
    this.ships = ships; // object mapping shipId -> Ship
    this.emitter = emitter;
  }

  placeShip(shipId, x, y, orientation) {
    const ship = this.ships[shipId];
    if (!ship) throw new Error('INVALID_SHIP_ID');
    if (ship.isPlaced) throw new Error('SHIP_ALREADY_PLACED');

    if (!this.board.isValidPosition(x, y, ship.length, orientation)) {
      this.emitter.emit('PLACEMENT_INVALID', {
        type: 'PLACEMENT_INVALID',
        shipId,
        attemptedPosition: { x, y },
        reason: 'OUT_OF_BOUNDS',
        timestamp: Date.now(),
      });
      throw new Error('SHIP_OUT_OF_BOUNDS');
    }

    const cells = this.board.getOccupiedCells(x, y, ship.length, orientation);
    for (const cell of cells) {
      const occupant = this.board.shipPositions.get(cell);
      if (occupant) {
        this.emitter.emit('PLACEMENT_INVALID', {
          type: 'PLACEMENT_INVALID',
          shipId,
          attemptedPosition: { x, y },
          reason: 'OVERLAP_DETECTED',
          timestamp: Date.now(),
        });
        throw new Error('SHIP_OVERLAP');
      }
    }

    this.board.markCellsOccupied(cells, shipId);
    ship.place({ x, y }, orientation);
    this.emitter.emit('SHIP_PLACED', {
      type: 'SHIP_PLACED',
      shipId,
      position: { x, y },
      orientation,
      affectedCells: cells,
      timestamp: Date.now(),
    });
  }

  rotateShip(shipId) {
    const ship = this.ships[shipId];
    if (!ship) throw new Error('INVALID_SHIP_ID');
    if (!ship.isPlaced) throw new Error('ship is not placed');

    const newOrientation =
      ship.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    if (
      !this.board.isValidPosition(
        ship.position.x,
        ship.position.y,
        ship.length,
        newOrientation
      )
    ) {
      throw new Error('SHIP_OUT_OF_BOUNDS');
    }

    const newCells = this.board.getOccupiedCells(
      ship.position.x,
      ship.position.y,
      ship.length,
      newOrientation
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const cell of newCells) {
      const occupant = this.board.shipPositions.get(cell);
      if (occupant && occupant !== shipId) {
        throw new Error('SHIP_OVERLAP');
      }
    }

    this.board.clearCells(ship.occupiedCells);
    this.board.markCellsOccupied(newCells, shipId);
    const previousOrientation = ship.orientation;
    ship.rotate();

    this.emitter.emit('SHIP_ROTATED', {
      type: 'SHIP_ROTATED',
      shipId,
      previousOrientation,
      newOrientation,
      affectedCells: {
        cleared: ship.occupiedCells,
        occupied: newCells,
      },
      timestamp: Date.now(),
    });

    return newCells;
  }

  areAllShipsPlaced() {
    return Object.values(this.ships).every((s) => s.isPlaced);
  }

  getShipAt(coordinate) {
    const occupant = this.board.shipPositions.get(coordinate);
    return occupant ? this.ships[occupant] || null : null;
  }

  recordAttack(coordinate) {
    if (this.board.hasBeenGuessed(coordinate)) {
      throw new Error('CELL_ALREADY_GUESSED');
    }
    const occupant = this.board.shipPositions.get(coordinate);
    const hit = Boolean(occupant);
    this.board.markGuess(coordinate, hit);
    if (hit) {
      const ship = this.ships[occupant];
      ship.recordHit(coordinate);
      return {
        hit: true,
        shipId: ship.id,
        shipSunk: ship.isSunk,
        coordinates: coordinate,
      };
    }
    return {
      hit: false,
      shipId: null,
      shipSunk: false,
      coordinates: coordinate,
    };
  }

  areAllShipsSunk() {
    return Object.values(this.ships).every((s) => s.isSunk);
  }

  validatePlacement(shipId, x, y, orientation) {
    const ship = this.ships[shipId];
    if (!ship) throw new Error('INVALID_SHIP_ID');
    const cells = this.board.getOccupiedCells(x, y, ship.length, orientation);
    const isWithinBounds = this.board.isValidPosition(
      x,
      y,
      ship.length,
      orientation
    );
    const hasNoOverlap = cells.every((c) => !this.board.shipPositions.has(c));
    const shipNotAlreadyPlaced = !ship.isPlaced;
    const outOfBoundsCells = isWithinBounds
      ? []
      : cells.filter((c) => {
          const [xs, ys] = c.split(',');
          const cx = Number(xs);
          const cy = Number(ys);
          return !this.board.withinBounds(cx, cy);
        });
    const overlappingCells = cells.filter((c) =>
      this.board.shipPositions.has(c)
    );
    return {
      isWithinBounds,
      hasNoOverlap,
      shipNotAlreadyPlaced,
      outOfBoundsCells,
      overlappingCells,
    };
  }

  reset() {
    Object.values(this.ships).forEach((s) => s.reset());
    this.board.reset();
  }
}

// eslint-disable-next-line import/prefer-default-export
export { Fleet };
