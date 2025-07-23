import { UIRenderer } from './uiRenderer.js';
import { GameBoard } from '../game_board/gameBoard.js';

// simple event bus mock
class MockEventBus {
  constructor() {
    this.events = [];
  }

  emit(event) {
    this.events.push(event);
  }

  subscribe(eventType, handler) {
    this.handler = handler;
    return () => {};
  }
}

let ui;
let bus;
let container;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="board"></div>
    <div id="message"></div>
    <div id="setup-panel"></div>`;
  bus = new MockEventBus();
  ui = new UIRenderer(bus);
  container = document.getElementById('board');
});

describe('UIRenderer.renderBoard', () => {
  test('Happy path renders 10x10 grid', () => {
    const board = new GameBoard();
    ui.renderBoard(board, false, 'board');
    expect(container.querySelectorAll('.cell').length).toBe(100);
  });

  test('Boundary showShips true adds ship classes', () => {
    const board = new GameBoard();
    board.markCellsOccupied(['0,0'], 'patrol');
    ui.renderBoard(board, true, 'board');
    expect(
      container
        .querySelector('.cell[data-coordinate="0,0"]')
        .classList.contains('ship')
    ).toBe(true);
  });
});

describe('UIRenderer.renderShip', () => {
  test('Adds ship element to container', () => {
    const shipElemContainer = document.createElement('div');
    const ship = {
      id: 'patrol',
      length: 2,
      orientation: 'horizontal',
      getOccupiedCells: () => ['0,0', '1,0'],
    };
    ui.renderShip(ship, shipElemContainer);
    expect(shipElemContainer.querySelectorAll('.ship').length).toBe(1);
  });
});

describe('UIRenderer.showHit', () => {
  test('Emits VisualFeedbackEvent and marks DOM', async () => {
    container.innerHTML = '<div class="cell" data-coordinate="0,0"></div>';
    await ui.showHit('0,0', 'board');
    expect(container.querySelector('.cell').classList.contains('hit')).toBe(
      true
    );
    expect(bus.events[0].type).toBe('VISUAL_FEEDBACK');
  });
});

describe('UIRenderer.showMiss', () => {
  test('Emits VisualFeedbackEvent and marks DOM', async () => {
    container.innerHTML = '<div class="cell" data-coordinate="0,1"></div>';
    await ui.showMiss('0,1', 'board');
    expect(container.querySelector('.cell').classList.contains('miss')).toBe(
      true
    );
    expect(bus.events[0].type).toBe('VISUAL_FEEDBACK');
  });
});

describe('UIRenderer.updateMessage', () => {
  test('Updates text content', () => {
    ui.updateMessage({ text: 'Hello', type: 'info' });
    expect(document.getElementById('message').textContent).toBe('Hello');
  });
});

describe('UIRenderer.toggleSetupUI', () => {
  test('Hides and shows setup panel', () => {
    const panel = document.getElementById('setup-panel');
    ui.toggleSetupUI(false);
    expect(panel.classList.contains('hidden')).toBe(true);
    ui.toggleSetupUI(true);
    expect(panel.classList.contains('hidden')).toBe(false);
  });
});

describe('UIRenderer.showEndgame', () => {
  test('Displays victory text and emits audio event', () => {
    ui.showEndgame('player', { turns: 10 });
    expect(document.body.textContent).toContain('player');
    expect(bus.events[0].type).toBe('AUDIO_FEEDBACK');
  });
});

describe('UIRenderer.highlightCells and clearHighlights', () => {
  test('Adds and removes highlight classes', () => {
    container.innerHTML =
      '<div class="cell" data-coordinate="0,0"></div><div class="cell" data-coordinate="1,0"></div>';
    ui.highlightCells(['0,0', '1,0'], true);
    expect(container.querySelectorAll('.highlight-valid').length).toBe(2);
    ui.clearHighlights();
    expect(container.querySelectorAll('.highlight-valid').length).toBe(0);
  });
});
