/* eslint-disable no-new */
import './styles.css';

import { GameBoard } from './game_board/gameBoard.js';
import { Ship } from './ship/ship.js';
import { UIRenderer } from './ui_renderer/uiRenderer.js';
import { PvCGame } from './pvc_game/pVcGame.js';
import { PvPGame } from './pvp_game/pVpGame.js';

// const computerBoard = new GameBoard();

function initGame() {
  const template = document.getElementById('body');
  const clone = template.content.cloneNode(true);
  document.body.appendChild(clone);

  const createShips = () => ({
    carrier: new Ship('carrier', 5),
    battleship: new Ship('battleship', 4),
    destroyer: new Ship('destroyer', 3),
    submarine: new Ship('submarine', 2),
    patrol: new Ship('patrol', 1),
  });

  const playerBoard = new GameBoard('player', createShips());
  const opponentBoard = new GameBoard('opponent', createShips());
  // Phase 3: UI layer

  // const aiStrategy = new AIStrategy();
  const onStartCallback = async (matchType) => {
    if (matchType === 'computer') {
      new PvCGame(playerBoard, opponentBoard);
    } else {
      new PvPGame(playerBoard, opponentBoard);
    }
  };

  new UIRenderer(playerBoard, opponentBoard, onStartCallback);

  document.getElementById('play-again').addEventListener('click', () => {
    window.location.reload();
  });
}

initGame();
