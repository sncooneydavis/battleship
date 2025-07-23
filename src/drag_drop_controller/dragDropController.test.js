import { EventEmitter } from 'node:events';
import { DragDropController } from './dragDropController.js';
import { GameBoard } from '../game_board/gameBoard.js';
import { Ship } from '../ship/ship.js';

let controller;
let board;
let emitter;
let ship;

beforeEach(() => {
  emitter = new EventEmitter();
  controller = new DragDropController(emitter);
  board = new GameBoard();
  ship = new Ship('patrol', 2);
});

describe('DragDropController.startDrag', () => {
  test('Happy-path - initializes drag state and emits event', () => {
    const events = [];
    emitter.on('DRAG_STARTED', (e) => events.push(e));
    controller.startDrag('patrol', { x: 0, y: 0 });
    expect(controller.isDragging()).toBe(true);
    expect(controller.dragState.shipId).toBe('patrol');
    expect(events[0]).toMatchObject({ type: 'DRAG_STARTED', shipId: 'patrol' });
  });

  test('State violation - start when already dragging throws', () => {
    controller.startDrag('patrol', { x: 0, y: 0 });
    expect(() => controller.startDrag('patrol', { x: 1, y: 1 })).toThrow(
      'INVALID_STATE'
    );
  });
});

describe('DragDropController.updateDragPosition', () => {
  test('Happy-path - updates ghost position and validity', () => {
    controller.startDrag('patrol', { x: 0, y: 0 });
    controller.updateDragPosition({ x: 2, y: 2 }, board);
    expect(controller.dragState.ghostPosition).toEqual({ x: 2, y: 2 });
    expect(typeof controller.dragState.validPlacement).toBe('boolean');
  });

  test('Invalid - called before startDrag', () => {
    expect(() => controller.updateDragPosition({ x: 1, y: 1 }, board)).toThrow(
      'INVALID_STATE'
    );
  });
});

describe('DragDropController.canDropAt', () => {
  test('Boundary - valid drop at edge', () => {
    controller.startDrag('patrol', { x: 8, y: 9 });
    controller.updateDragPosition({ x: 8, y: 9 }, board);
    expect(controller.canDropAt(8, 9)).toBe(true);
  });

  test('Invalid - query before drag begins', () => {
    expect(() => controller.canDropAt(0, 0)).toThrow('INVALID_STATE');
  });
});

describe('DragDropController.completeDrop', () => {
  test('Happy-path - returns placement attempt and clears state', () => {
    controller.startDrag('patrol', { x: 1, y: 1 });
    controller.updateDragPosition({ x: 1, y: 1 }, board);
    const result = controller.completeDrop();
    expect(result).toMatchObject({
      shipId: 'patrol',
      position: { x: 1, y: 1 },
    });
    expect(controller.isDragging()).toBe(false);
  });

  test('Error - drop when position invalid', () => {
    controller.startDrag('patrol', { x: 9, y: 9 });
    controller.updateDragPosition({ x: 9, y: 9 }, board);
    controller.dragState.validPlacement = false;
    expect(() => controller.completeDrop()).toThrow('DROP_INVALID');
  });
});

describe('DragDropController.cancelDrag', () => {
  test('Happy-path - clears state and emits event', () => {
    const events = [];
    emitter.on('DRAG_CANCELLED', (e) => events.push(e));
    controller.startDrag('patrol', { x: 0, y: 0 });
    controller.cancelDrag();
    expect(controller.isDragging()).toBe(false);
    expect(events.length).toBe(1);
    expect(events[0]).toMatchObject({
      type: 'DRAG_CANCELLED',
      shipId: 'patrol',
    });
  });

  test('Invalid - cancel when not dragging', () => {
    expect(() => controller.cancelDrag()).toThrow('INVALID_STATE');
  });
});
