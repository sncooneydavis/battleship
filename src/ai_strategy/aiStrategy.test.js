import { AIStrategy } from './aiStrategy.js';
import { GameBoard } from '../game_board/gameBoard.js';

let board;
let strategy;

beforeEach(() => {
  board = new GameBoard();
  strategy = new AIStrategy();
});

describe('AIStrategy.getNextMove', () => {
  test('Happy-path - returns first unguessed coordinate', () => {
    const coord = strategy.getNextMove(board);
    expect(board.withinBounds(...coord.split(',').map(Number))).toBe(true);
    expect(board.hasBeenGuessed(coord)).toBe(false);
  });

  test('Invalid - no valid moves left', () => {
    // mark all cells as guessed
    for (let x = 0; x < board.width; x += 1) {
      for (let y = 0; y < board.height; y += 1) {
        board.markGuess(`${x},${y}`, false);
      }
    }
    expect(() => strategy.getNextMove(board)).toThrow('NO_VALID_MOVES');
  });
});

describe('AIStrategy.recordResult', () => {
  test('Happy-path - recording a hit queues neighbors and sets mode', () => {
    const coord = '3,3';
    strategy.recordResult(coord, { hit: true }, board);
    expect(strategy.getCurrentMode()).toBe('hunting');
    const expectedNeighbors = ['4,3', '2,3', '3,4', '3,2'];
    expectedNeighbors.forEach((n) => {
      expect(strategy.hitQueue).toContain(n);
    });
  });

  test('Edge - miss clears hunting mode when no queue', () => {
    strategy.recordResult('1,1', { hit: false });
    expect(strategy.getCurrentMode()).toBe('random');
  });
});

describe('AIStrategy.reset', () => {
  test('Stateful reset clears all internal tracking', () => {
    strategy.recordResult('0,0', { hit: true }, board);
    strategy.reset();
    expect(strategy.getCurrentMode()).toBe('random');
    expect(strategy.hitQueue.length).toBe(0);
    expect(strategy.attemptedCells.size).toBe(0);
  });
});

describe('AIStrategy.recordResult neighbor generation', () => {
  test('Boundary - hit at edge only queues valid neighbors', () => {
    const coord = '0,0';
    strategy.recordResult(coord, { hit: true }, board);
    expect(strategy.hitQueue).toEqual(['1,0', '0,1']);
  });
});
