# Battleship Game Module Boundaries

## Module Definitions

### 1. GameBoard

**Primary Responsibility**: Manage board state and validate cell operations

**Owned Data**:

- cells: 10x10 grid arraym
- dimensions: {width: 10, height: 10}

**Exposed Operations**:

- `isValidPosition(x, y, length, orientation)`: Check if ship placement is in bounds
- `getOccupiedCells(x, y, length, orientation)`: Get list of cells a ship would occupy
- `markCellsOccupied(cells, shipId)`: Mark cells as occupied by a ship
- `clearCells(cells)`: Clear occupation status
- `getCellState(x, y)`: Get current state of a cell
- `markGuess(x, y, isHit)`: Record a guess result

### 2. Ship

**Primary Responsibility**: Represent individual ship state and properties **Owned Data**:

- id: unique identifier
- length: 1-5
- position: {x, y} or null
- orientation: 'horizontal' | 'vertical'
- hitCells: Set of hit positions
- isPlaced: boolean
- isSunk: boolean

**Exposed Operations**:

- `place(x, y, orientation)`: Set ship position
- `rotate()`: Change orientation (if valid)
- `recordHit(x, y)`: Mark cell as hit
- `checkIfSunk()`: Determine if all cells are hit
- `reset()`: Clear placement and hits
- `getOccupiedCells()`: Return current cell positions

### 3. Fleet

**Primary Responsibility**: Manage collection of ships for one player **Owned Data**:

- ships: Array of 5 Ship instances
- board: Reference to GameBoard instance

**Exposed Operations**:

- `placeShip(shipId, x, y, orientation)`: Place a specific ship
- `rotateShip(shipId)`: Rotate a specific ship
- `areAllShipsPlaced()`: Check if all 5 ships are positioned
- `getShipAt(x, y)`: Find ship at given position
- `recordHit(x, y)`: Process hit at position
- `areAllShipsSunk()`: Check for game end condition
- `reset()`: Reset all ships and board

### 4. GameState

**Primary Responsibility**: Manage game phase and turn control **Owned Data**:

- phase: 'setup' | 'gameplay' | 'endgame'
- currentTurn: 'player' | 'computer' | null
- winner: 'player' | 'computer' | null

**Exposed Operations**:

- `canStartGame()`: Check if setup is complete
- `startGame()`: Transition to gameplay phase
- `switchTurn()`: Alternate between players
- `endGame(winner)`: Transition to endgame
- `isPlayerTurn()`: Check current turn
- `getCurrentPhase()`: Get current game phase
- `reset()`: Return to initial state

### 5. AIStrategy

**Primary Responsibility**: Generate intelligent computer moves **Owned Data**:

- targetingMode: 'random' | 'hunting' | 'sinking'
- lastHit: {x, y} or null
- hitQueue: Array of potential targets
- attemptedCells: Set of guessed positions

**Exposed Operations**:

- `getNextMove(board)`: Generate next guess coordinates
- `recordResult(x, y, wasHit)`: Update strategy based on result
- `reset()`: Clear targeting state

### 6. DragDropController

**Primary Responsibility**: Handle ship placement drag-and-drop interactions **Owned Data**:

- draggedShip: current ship being dragged
- validDropZone: calculated valid placement area
- ghostPosition: preview position

**Exposed Operations**:

- `startDrag(shipId, mousePosition)`: Begin drag operation
- `updateDragPosition(mousePosition)`: Update ghost preview
- `canDropAt(x, y)`: Check if current position is valid
- `completeDrop(x, y)`: Finalize ship placement
- `cancelDrag()`: Abort drag operation

### 7. UIRenderer

**Primary Responsibility**: Render game visuals and handle display updates **Owned Data**:

- boardElements: DOM references
- messageElement: status display
- activeAnimations: current visual effects

**Exposed Operations**:

- `renderBoard(board, showShips)`: Draw board state
- `renderShip(ship, container)`: Draw individual ship
- `showHit(x, y, board)`: Animate hit effect
- `showMiss(x, y, board)`: Animate miss effect
- `updateMessage(text)`: Update status text
- `toggleSetupUI(visible)`: Show/hide placement tools
- `showEndgame(winner)`: Display victory screen

### 8. GameController

**Primary Responsibility**: Orchestrate game flow and coordinate modules **Owned Data**:

- playerFleet: Fleet instance
- computerFleet: Fleet instance
- gameState: GameState instance
- aiStrategy: AIStrategy instance
- uiRenderer: UIRenderer instance
- dragDropController: DragDropController instance

**Exposed Operations**:

- `initializeGame()`: Set up initial state
- `handleShipPlacement(shipId, x, y)`: Process placement
- `handleShipRotation(shipId)`: Process rotation
- `handleStartGame()`: Validate and begin game
- `handlePlayerGuess(x, y)`: Process player turn
- `executeComputerTurn()`: Process AI turn
- `handleReset()`: Reset entire game

## Module Dependency Matrix

                    │ GB │ Sh │ Fl │ GS │ AI │ DD │ UI │ GC │
────────────────────┼────┼────┼────┼────┼────┼────┼────┼────┤
GameBoard (GB)      │ ✓  │    │    │    │    │    │    │    │
Ship (Sh)           │    │ ✓  │    │    │    │    │    │    │
Fleet (Fl)          │ ←  │ ←  │ ✓  │    │    │    │    │    │
GameState (GS)      │    │    │    │ ✓  │    │    │    │    │
AIStrategy (AI)     │ ←  │    │    │    │ ✓  │    │    │    │
DragDropController  │ ←  │ ←  │ ←  │    │    │ ✓  │    │    │
UIRenderer (UI)     │ ←  │ ←  │    │    │    │    │ ✓  │    │
GameController (GC) │    │    │ ←  │ ←  │ ←  │ ←  │ ←  │ ✓  │

← = depends on (reads from)

## Dependency Analysis

### Zero Dependencies (Leaf Modules)

- **GameBoard**: Pure data structure with validation logic
- **Ship**: Simple entity with self-contained state
- **GameState**: Pure state machine

### Single Dependencies

- **Fleet**: Depends on Ship and GameBoard
- **AIStrategy**: Depends only on board state for decisions

### UI Layer Dependencies

- **DragDropController**: Depends on board validation and ship data
- **UIRenderer**: Depends on game entities for rendering

### Orchestration Layer

- **GameController**: Central coordinator with managed dependencies on all other modules

## Context Fit Assessment

Each module is designed to fit within a single LLM context window:

- **Smallest**: Ship (~50 lines)
- **Largest**: GameController (~200 lines)
- **Average**: ~100 lines per module

This modular design ensures:

1. Each module can be understood in isolation
2. Changes are localized to specific modules
3. Testing can focus on individual module behavior
4. The full system can be assembled from well-defined parts
