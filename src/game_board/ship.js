class Ship {
  constructor(id, length) {
    this.id = id;
    this.length = length;
    this.position = null;
    this.orientation = null;
    this.isPlaced = false;
    this.occupiedCells = [];
    this.hitCells = new Set();
    this.isSunk = false;
  }

  withinBounds = (x, y) => x >= 0 && y >= 0 && x < 10 && y < 10;

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
    if (this.isPlaced) throw new Error('SHIP_ALREADY_PLACED');
    this.position = { x: pos.x, y: pos.y };
    this.orientation = orientation;
    this.occupiedCells = this.computeCells(pos.x, pos.y, orientation);
    this.isPlaced = true;
  };

  rotate = () => {
    if (!this.isPlaced) throw new Error('ship is not placed');
    this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const { x, y } = this.position;
    this.occupiedCells = this.computeCells(x, y, this.orientation);
    return this.occupiedCells;
  };

  recordHit = (coordinate) => {
    if (!this.occupiedCells.includes(coordinate)) {
      throw new Error('coordinate is not part of this ship');
    }
    this.hitCells.add(coordinate);
    this.checkIfSunk();
  };

  checkIfSunk = () => {
    if (!this.isPlaced) return false;
    this.isSunk = this.hitCells.size === this.occupiedCells.length;
    return this.isSunk;
  };

  getOccupiedCells = () => (this.isPlaced ? [...this.occupiedCells] : []);

  reset = () => {
    this.position = null;
    this.orientation = null;
    this.isPlaced = false;
    this.occupiedCells = [];
    this.hitCells = new Set();
    this.isSunk = false;
  };
}

export { Ship };
