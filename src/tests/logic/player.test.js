import { PlayerFactory } from '../../logic/player.js';

const mockReceiveAttack = jest.fn();
const mockGetAttackHistory = jest.fn(() => []);
const createMockGameboard = () => ({
  receiveAttack: mockReceiveAttack,
  getAttackHistory: mockGetAttackHistory,
});

describe('PlayerFactory.createPlayers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates one HumanPlayer and one ComputerPlayer with default names', () => {
    const [human, computer] = PlayerFactory.createPlayers({
      gameboardFactory: createMockGameboard,
    });

    expect(human.type).toBe('human');
    expect(computer.type).toBe('computer');
    expect(human.gameboard).toBeDefined();
    expect(computer.gameboard).toBeDefined();
    expect(typeof human.submitAttack).toBe('function');
    expect(typeof computer.getNextMove).toBe('function');
  });

  test('assigns provided player names correctly', () => {
    const [human, computer] = PlayerFactory.createPlayers({
      humanName: 'Alice',
      computerName: 'HAL',
      gameboardFactory: createMockGameboard,
    });

    expect(human.name).toBe('Alice');
    expect(computer.name).toBe('HAL');
  });
});

describe('HumanPlayer.submitAttack', () => {
  let human;

  beforeEach(() => {
    jest.clearAllMocks();
    [human] = PlayerFactory.createPlayers({
      gameboardFactory: createMockGameboard,
    });
  });

  test('returns result of valid attack on gameboard', () => {
    mockReceiveAttack.mockReturnValue('hit');
    const result = human.submitAttack([1, 1]);
    expect(mockReceiveAttack).toHaveBeenCalledWith([1, 1]);
    expect(result).toBe('hit');
  });

  test('throws error on invalid coordinate format', () => {
    expect(() => human.submitAttack('invalid')).toThrow(
      'Invalid coordinate: must be a [x, y] pair'
    );
    expect(mockReceiveAttack).not.toHaveBeenCalled();
  });

  test('throws error for out-of-bounds coordinates', () => {
    expect(() => human.submitAttack([-1, 10])).toThrow(
      'Coordinate out of bounds'
    );
  });
});

describe('ComputerPlayer.getNextMove', () => {
  let computer;

  beforeEach(() => {
    jest.clearAllMocks();
    [, computer] = PlayerFactory.createPlayers({
      gameboardFactory: createMockGameboard,
    });
  });

  test('returns a valid untried coordinate', () => {
    mockGetAttackHistory.mockReturnValue([
      [0, 0],
      [1, 1],
    ]);
    const move = computer.getNextMove();
    expect(Array.isArray(move)).toBe(true);
    expect(move.length).toBe(2);
    expect(move).not.toEqual([0, 0]);
    expect(move).not.toEqual([1, 1]);
  });

  test('throws error if no valid moves remain', () => {
    mockGetAttackHistory.mockReturnValue(
      Array.from({ length: 100 }, (_, i) => [i % 10, Math.floor(i / 10)])
    );
    expect(() => computer.getNextMove()).toThrow('No valid moves remaining');
  });
});
