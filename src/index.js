import './styles.css';

import { GameBoard } from './game_board/gameBoard.js';
import { GameState } from './game_state/gameState.js';
import { Ship } from './ship/ship.js';
import { AIStrategy } from './ai_strategy/aiStrategy.js';
import { UIRenderer } from './ui_renderer/uiRenderer.js';
import { DragDropController } from './drag_drop_controller/dragDropController.js';
import { GameController } from './game_controller/gameController.js';

// const computerBoard = new GameBoard();

const createShips = () => ({
  carrier: new Ship('carrier', 5),
  battleship: new Ship('battleship', 4),
  destroyer: new Ship('destroyer', 3),
  submarine: new Ship('submarine', 2),
  patrol: new Ship('patrol', 1),
});

const playerBoard = new GameBoard('player', createShips());

// const aiStrategy = new AIStrategy();

// Phase 3: UI layer
window.addEventListener('DOMContentLoaded', () => {
  const uiRenderer = new UIRenderer();
  uiRenderer.renderBoard(playerBoard, 'player-board');
  const playerDragDropController = new DragDropController(playerBoard);
  playerDragDropController.addEventListeners();
});

// Phase 4: controller layer
// const gameController = new GameController({
//   playerBoard,
//   computerBoard,
//   playerFleet,
//   gameState,
//   uiRenderer,
//   dragDropController,
//   eventBus,
// });

// get start game from event from event bus
const gameState = new GameState();
