import './styles.css';

import { EventBus } from './eventBus.js';
import { GameBoard } from './game_board/gameBoard.js';
import { GameState } from './game_state/gameState.js';
import { Fleet } from './fleet/fleet.js';
import { Ship } from './ship/ship.js';
import { AIStrategy } from './ai_strategy/aiStrategy.js';
import { UIRenderer } from './ui_renderer/uiRenderer.js';
import { DragDropController } from './drag_drop_controller/dragDropController.js';
import { GameController } from './game_controller/gameController.js';

// Phase 1: core infrastructure
const eventBus = new EventBus();
const playerBoard = new GameBoard();
// const computerBoard = new GameBoard();
const gameState = new GameState(eventBus);

// Phase 2: domain layer
const createShips = () => ({
  carrier: new Ship('carrier', 5),
  battleship: new Ship('battleship', 4),
  destroyer: new Ship('destroyer', 3),
  submarine: new Ship('submarine', 2),
  patrol: new Ship('patrol', 1),
});

const playerFleet = new Fleet('player', playerBoard, createShips(), eventBus);
// const computerFleet = new Fleet(
//   'computer',
//   computerBoard,
//   createShips(),
//   eventBus
// );
// const aiStrategy = new AIStrategy();

// Phase 3: UI layer
const uiRenderer = new UIRenderer(eventBus);
const playerDragDropController = new DragDropController(
  playerBoard,
  playerFleet,
  eventBus
);

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

uiRenderer.renderBoard(this.playerBoard, 'player-board');
playerDragDropController.addEventListeners();
