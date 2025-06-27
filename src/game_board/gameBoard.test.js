import { GameBoard } from './gameBoard.js';

let board;
beforeEach(() => {
  board = new GameBoard();
});

describe('GameBoard.isValidPosition', () => {
  test('Happy-path – fits completely', () => {
    expect(board.isValidPosition(2, 3, 3, 'horizontal')).toBe(true);
  });

  test('Edge – touches right border exactly', () => {
    expect(board.isValidPosition(7, 0, 3, 'horizontal')).toBe(true);
  });

  test('Invalid – runs past border', () => {
    expect(board.isValidPosition(8, 5, 4, 'horizontal')).toBe(false);
  });
});

describe('GameBoard.getOccupiedCells', () => {
  test('Happy-path', () => {
    const cells = board.getOccupiedCells(2, 3, 3, 'horizontal');
    expect(cells).toEqual(['2,3', '3,3', '4,3']);
  });

  test('Edge – vertical at bottom edge', () => {
    const cells = board.getOccupiedCells(0, 8, 2, 'vertical');
    expect(cells).toEqual(['0,8', '0,9']);
  });

  test('Invalid – out-of-bounds start', () => {
    const cells = board.getOccupiedCells(9, 9, 3, 'horizontal');
    expect(cells).toEqual([]);
  });
});

describe('GameBoard.markCellsOccupied', () => {
  test('Happy-path – board empty', () => {
    board.markCellsOccupied(['2,3', '3,3'], 'destroyer');
    expect(board.getCellState('2,3')).toBe('occupied');
    expect(board.getCellState('3,3')).toBe('occupied');
  });

  test('Edge – final free cells in row 9', () => {
    board.markCellsOccupied(['8,9', '9,9'], 'patrol');
    expect(board.getCellState('8,9')).toBe('occupied');
    expect(board.getCellState('9,9')).toBe('occupied');
  });

  test('Invalid – one cell already occupied', () => {
    board.markCellsOccupied(['2,3', '3,3'], 'destroyer');
    expect(() => board.markCellsOccupied(['2,3'], 'carrier')).toThrow(
      'SHIP_OVERLAP'
    );
  });
});

describe('GameBoard.clearCells', () => {
  test('Happy-path – clear a single occupied cell', () => {
    board.markCellsOccupied(['2,3'], 'submarine');
    board.clearCells(['2,3']);
    expect(board.getCellState('2,3')).toBe('empty');
  });

  test('Edge – clear the final occupied cell, leaving an all-empty board', () => {
    board.markCellsOccupied(['1,1'], 'patrol');
    board.clearCells(['1,1']);
    expect(board.getCellState('1,1')).toBe('empty');
    expect(board.shipPositions.size).toBe(0);
  });

  test('Invalid – coordinate outside board', () => {
    expect(() => board.clearCells(['10,0'])).toThrow('INVALID_COORDINATE');
  });
});

describe('GameBoard.getCellState', () => {
  test('Happy-path – empty cell', () => {
    expect(board.getCellState('4,4')).toBe('empty');
  });

  test('Edge – cell that became hit after a guess', () => {
    board.markCellsOccupied(['0,0'], 'patrol');
    board.markGuess('0,0', true);
    expect(board.getCellState('0,0')).toBe('hit');
  });

  test('Invalid – out-of-bounds', () => {
    expect(() => board.getCellState('10,5')).toThrow('INVALID_COORDINATE');
  });
});

describe('GameBoard.markGuess', () => {
  test('Happy-path miss', () => {
    board.markGuess('5,5', false);
    expect(board.getCellState('5,5')).toBe('miss');
    expect(board.hasBeenGuessed('5,5')).toBe(true);
  });

  test('Edge – last healthy segment of a ship', () => {
    board.markCellsOccupied(['0,0'], 'patrol');
    board.markGuess('0,0', true);
    expect(board.getCellState('0,0')).toBe('hit');
    // assuming board tracks sunk ships, but we just check cell state
  });

  test('Invalid – guessing same cell twice', () => {
    board.markGuess('5,5', false);
    expect(() => board.markGuess('5,5', false)).toThrow('CELL_ALREADY_GUESSED');
  });
});

describe('GameBoard.hasBeenGuessed', () => {
  test('Before any guess', () => {
    expect(board.hasBeenGuessed('7,7')).toBe(false);
  });

  test('After a guess', () => {
    board.markGuess('5,5', false);
    expect(board.hasBeenGuessed('5,5')).toBe(true);
  });

  test('Invalid – out-of-bounds', () => {
    expect(() => board.hasBeenGuessed('11,3')).toThrow('INVALID_COORDINATE');
  });
});

describe('GameBoard.reset', () => {
  test('Stateful reset – board contained ships and guesses', () => {
    board.markCellsOccupied(['1,1'], 'submarine');
    board.markGuess('5,5', false);
    board.reset();
    expect(board.getCellState('1,1')).toBe('empty');
    expect(board.shipPositions.size).toBe(0);
    expect(board.guessHistory.size).toBe(0);
  });

  test('Edge – reset when board already pristine', () => {
    board.reset();
    const pristineSnapshot = JSON.stringify(board);
    board.reset();
    expect(JSON.stringify(board)).toBe(pristineSnapshot);
  });
});
