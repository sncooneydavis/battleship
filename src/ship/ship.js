/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
class Ship {
  constructor(id, length) {
    this.id = id;
    this.length = length;
    this.position = null;
    this.orientation = 'vertical';
    this.cellsOccupied = [];
    this.hitCells = new Set();
    this.isSunk = false;
  }

  computeCells = (x, y, orientation) => {
    const cells = [];
    for (let i = 0; i < this.length; i += 1) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;
      cells.push(`${cx},${cy}`);
    }
    return cells;
  };

  place = (pos, orientation) => {
    this.position = { x: pos.x, y: pos.y };
    this.orientation = orientation;
    this.cellsOccupied = this.computeCells(pos.x, pos.y, orientation);
  };

  rotate = () => {
    this.orientation =
      this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const { x, y } = this.position;
    this.cellsOccupied = this.computeCells(x, y, this.orientation);
    return this.cellsOccupied;
  };

  recordHit = (coordinate) => {
    if (!this.cellsOccupied.includes(coordinate)) {
      throw new Error('coordinate is not part of this ship');
    }
    this.hitCells.add(coordinate);
    this.checkIfSunk();
  };

  checkIfSunk = () => {
    this.isSunk = this.hitCells.size === this.cellsOccupied.length;
    return this.isSunk;
  };

  reset = () => {
    this.position = null;
    this.orientation = null;
    this.cellsOccupied = [];
    this.hitCells = new Set();
    this.isSunk = false;
  };
}

export { Ship };
