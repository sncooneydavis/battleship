# Battleship Game API Contracts

## 1. GameBoard Module

### Public Methods

```typescript
class GameBoard {
  /**
   * Check if a ship placement would be within board boundaries
   * @pre: 0 <= x < width, 0 <= y < height, length > 0
   * @post: returns true if entire ship fits on board
   */
  isValidPosition(x: number, y: number, length: number, orientation: Orientation): boolean

  /**
   * Get list of cells a ship would occupy at given position
   * @pre: position and orientation are defined
   * @post: returns array of CellCoordinate strings
   * @throws: never - returns empty array for invalid positions
   */
  getOccupiedCells(x: number, y: number, length: number, orientation: Orientation): CellCoordinate[]

  /**
   * Mark cells as occupied by a specific ship
   * @pre: cells array is non-empty, all cells are within bounds
   * @post: cells are marked as occupied with shipId reference
   * @throws: Error if any cell is already occupied
   */
  markCellsOccupied(cells: CellCoordinate[], shipId: ShipId): void

  /**
   * Clear occupation status for given cells
   * @pre: cells array is non-empty
   * @post: specified cells are marked as empty
   */
  clearCells(cells: CellCoordinate[]): void

  /**
   * Get the current state of a specific cell
   * @pre: coordinate is within board bounds
   * @post: returns current CellState
   * @throws: Error if coordinate is out of bounds
   */
  getCellState(coordinate: CellCoordinate): CellState

  /**
   * Record the result of a guess at the given coordinate
   * @pre: coordinate is within bounds, game is in gameplay phase
   * @post: cell is marked as 'hit' or 'miss'
   * @throws: Error if cell was already guessed
   */
  markGuess(coordinate: CellCoordinate, isHit: boolean): void

  /**
   * Check if a coordinate has been guessed
   * @pre: coordinate is valid
   * @post: returns true if cell has been guessed
   */
  hasBeenGuessed(coordinate: CellCoordinate): boolean

  /**
   * Reset board to initial empty state
   * @pre: none
   * @post: all cells are empty, no ships, no guesses
   */
  reset(): void
}


### Events Emitted

- None (pure data structure)

### Events Consumed

- None (pure data structure)

---
## 2. Ship Module

### Public Methods

```typescript
class Ship {
  /**
   * Place ship at specified position
   * @pre: ship is not already placed, position is valid
   * @post: ship.position is set, isPlaced becomes true
   * @throws: Error if ship is already placed
   */
  place(position: Position, orientation: Orientation): void

  /**
   * Rotate ship 90 degrees
   * @pre: ship is placed
   * @post: orientation toggles between horizontal/vertical
   * @returns: new occupied cells after rotation
   * @throws: Error if ship is not placed
   */
  rotate(): CellCoordinate[]

  /**
   * Record a hit on this ship
   * @pre: coordinate is one of ship's occupied cells
   * @post: coordinate is added to hitCells set
   * @throws: Error if coordinate is not part of this ship
   */
  recordHit(coordinate: CellCoordinate): void

  /**
   * Check if ship is completely sunk
   * @pre: none
   * @post: returns true if all occupied cells are hit
   */
  checkIfSunk(): boolean

  /**
   * Get all cells currently occupied by this ship
   * @pre: none
   * @post: returns array of CellCoordinate or empty if not placed
   */
  getOccupiedCells(): CellCoordinate[]

  /**
   * Reset ship to unplaced state
   * @pre: none
   * @post: position is null, hitCells is empty, isPlaced is false
   */
  reset(): void
}
```

### Events Emitted

- None (entity managed by Fleet)

### Events Consumed

- None (entity managed by Fleet)

---

## 3. Fleet Module

### Public Methods

```typescript
class Fleet {
  /**
   * Place a ship at the specified position
   * @pre: ship exists in fleet, position is valid, no overlap
   * @post: ship is placed on board
   * @emits: ShipPlacedEvent on success
   * @throws: PlacementError with reason
   */
  placeShip(shipId: ShipId, x: number, y: number, orientation: Orientation): void

  /**
   * Rotate a previously placed ship
   * @pre: ship is placed, rotation doesn't cause collision
   * @post: ship orientation is changed
   * @emits: ShipRotatedEvent on success
   * @throws: Error if rotation invalid
   */
  rotateShip(shipId: ShipId): void

  /**
   * Check if all ships have been placed
   * @pre: none
   * @post: returns true if all 5 ships are positioned
   */
  areAllShipsPlaced(): boolean

  /**
   * Get ship at specific coordinate
   * @pre: coordinate is valid
   * @post: returns Ship instance or null
   */
  getShipAt(coordinate: CellCoordinate): Ship | null

  /**
   * Process an incoming attack
   * @pre: coordinate hasn't been guessed before
   * @post: returns hit/miss result, updates ship damage
   * @returns: GuessResult with hit status and ship info
   */
  recordAttack(coordinate: CellCoordinate): GuessResult

  /**
   * Check if all ships are sunk
   * @pre: none
   * @post: returns true if no ships remain
   */
  areAllShipsSunk(): boolean

  /**
   * Get placement validation for a ship
   * @pre: ship exists
   * @post: returns validation result with details
   */
  validatePlacement(shipId: ShipId, x: number, y: number, orientation: Orientation): PlacementValidation

  /**
   * Reset fleet to initial state
   * @pre: none
   * @post: all ships reset, board cleared
   */
  reset(): void
}
```

### Events Emitted

- `ShipPlacedEvent`
- `ShipRotatedEvent`
- `PlacementInvalidEvent`

### Events Consumed

- None

---

## 4. GameState Module

### Public Methods

```typescript
class GameState {
  /**
   * Check if game can transition to gameplay phase
   * @pre: in setup phase
   * @post: returns true if all setup requirements met
   */
  canStartGame(playerFleetReady: boolean, computerFleetReady: boolean): boolean

  /**
   * Transition to gameplay phase
   * @pre: canStartGame() returns true
   * @post: phase becomes 'gameplay', turn set to 'player'
   * @emits: GameStartedEvent
   * @throws: Error if preconditions not met
   */
  startGame(): void

  /**
   * Switch to the other player's turn
   * @pre: in gameplay phase, current turn is set
   * @post: currentPlayer switches
   * @emits: TurnChangedEvent
   */
  switchTurn(): void

  /**
   * Check if it's currently the player's turn
   * @pre: none
   * @post: returns true if player's turn
   */
  isPlayerTurn(): boolean

  /**
   * End the game with a winner
   * @pre: in gameplay phase
   * @post: phase becomes 'endgame', winner is set
   * @emits: GameEndedEvent
   */
  endGame(winner: PlayerId): void

  /**
   * Get current game phase
   * @pre: none
   * @post: returns current phase
   */
  getCurrentPhase(): GamePhase

  /**
   * Reset to initial state
   * @pre: none
   * @post: phase is 'setup', turn is null, winner is null
   * @emits: GameResetEvent
   */
  reset(): void
}
```

### Events Emitted

- `GameStartedEvent`
- `TurnChangedEvent`
- `GameEndedEvent`
- `GameResetEvent`

### Events Consumed

- None

---

## 5. AIStrategy Module

### Public Methods

```typescript
class AIStrategy {
  /**
   * Generate next move for computer player
   * @pre: board state is provided, game is active
   * @post: returns unguessed coordinate
   * @throws: Error if no valid moves available
   */
  getNextMove(board: GameBoard): CellCoordinate

  /**
   * Update strategy based on guess result
   * @pre: coordinate was just guessed
   * @post: internal strategy state updated
   */
  recordResult(coordinate: CellCoordinate, result: GuessResult): void

  /**
   * Reset strategy to initial state
   * @pre: none
   * @post: all tracking data cleared
   */
  reset(): void

  /**
   * Get current targeting mode for debugging
   * @pre: none
   * @post: returns current strategy mode
   */
  getCurrentMode(): TargetingMode
}


### Events Emitted

- None

### Events Consumed

- None

---

## 6. DragDropController Module

### Public Methods

```typescript
class DragDropController {
  /**
   * Begin dragging a ship
   * @pre: ship exists and is available for placement
   * @post: drag state is initialized
   * @emits: DragStartedEvent
   */
  startDrag(shipId: ShipId, mousePosition: Position): void

  /**
   * Update drag preview position
   * @pre: drag is in progress
   * @post: ghost position updated, validity checked
   * @emits: DragUpdatedEvent with validity status
   */
  updateDragPosition(mousePosition: Position, board: GameBoard): void

  /**
   * Check if current drag position is valid for drop
   * @pre: drag is in progress
   * @post: returns true if position is valid
   */
  canDropAt(x: number, y: number): boolean

  /**
   * Complete the drag operation
   * @pre: drag in progress, position is valid
   * @post: drag state cleared
   * @returns: final placement position
   * @throws: Error if drop position invalid
   */
  completeDrop(): PlacementAttempt

  /**
   * Cancel current drag operation
   * @pre: drag is in progress
   * @post: drag state cleared
   * @emits: DragCancelledEvent
   */
  cancelDrag(): void

  /**
   * Check if currently dragging
   * @pre: none
   * @post: returns true if drag in progress
   */
  isDragging(): boolean
}
```

### Events Emitted

- `DragStartedEvent`
- `DragUpdatedEvent`
- `DragCancelledEvent`

### Events Consumed

- Mouse/touch events (from browser)

---

## 7. UIRenderer Module

### Public Methods

```typescript
class UIRenderer {
  /**
   * Render a game board
   * @pre: board data is valid
   * @post: board visually updated in DOM
   * @param showShips: whether to display ship positions
   */
  renderBoard(board: GameBoard, showShips: boolean, elementId: string): void

  /**
   * Render ship in drag container
   * @pre: ship exists
   * @post: ship element created/updated in DOM
   */
  renderShip(ship: Ship, container: HTMLElement): void

  /**
   * Display hit animation
   * @pre: coordinate is valid
   * @post: hit effect plays at location
   * @emits: VisualFeedbackEvent
   */
  showHit(coordinate: CellCoordinate, boardId: string): Promise<void>

  /**
   * Display miss animation
   * @pre: coordinate is valid
   * @post: miss effect plays at location
   * @emits: VisualFeedbackEvent
   */
  showMiss(coordinate: CellCoordinate, boardId: string): Promise<void>

  /**
   * Update game status message
   * @pre: none
   * @post: message displayed to user
   */
  updateMessage(message: StatusMessage): void

  /**
   * Toggle setup UI visibility
   * @pre: none
   * @post: setup tools shown/hidden
   */
  toggleSetupUI(visible: boolean): void

  /**
   * Show endgame screen
   * @pre: game has ended
   * @post: victory/defeat screen displayed
   * @emits: AudioFeedbackEvent
   */
  showEndgame(winner: PlayerId, stats: GameStats): void

  /**
   * Highlight valid drop zones during drag
   * @pre: cells array provided
   * @post: cells visually highlighted
   */
  highlightCells(cells: CellCoordinate[], valid: boolean): void

  /**
   * Clear all highlights
   * @pre: none
   * @post: all cell highlights removed
   */
  clearHighlights(): void
}


### Events Emitted

- `VisualFeedbackEvent`
- `AudioFeedbackEvent`

### Events Consumed

- All game events (for UI updates)

---

## 8. GameController Module

### Public Methods

```typescript
class GameController {
  /**
   * Initialize new game
   * @pre: none
   * @post: all modules initialized, UI ready
   * @emits: GameInitializedEvent
   */
  initializeGame(): void

  /**
   * Handle ship placement request
   * @pre: in setup phase
   * @post: ship placed if valid
   * @delegates: Fleet.placeShip
   */
  handleShipPlacement(shipId: ShipId, x: number, y: number, orientation: Orientation): void

  /**
   * Handle ship rotation request
   * @pre: ship is placed
   * @post: ship rotated if valid
   * @delegates: Fleet.rotateShip
   */
  handleShipRotation(shipId: ShipId): void

  /**
   * Handle game start request
   * @pre: all ships placed
   * @post: game transitions to gameplay
   * @delegates: GameState.startGame
   */
  handleStartGame(): void

  /**
   * Handle player's guess
   * @pre: player's turn, valid target
   * @post: guess processed, turn switched
   * @emits: GuessMadeEvent
   */
  handlePlayerGuess(x: number, y: number): void

  /**
   * Execute computer's turn
   * @pre: computer's turn
   * @post: AI makes move, turn switched
   * @emits: GuessMadeEvent
   */
  executeComputerTurn(): void

  /**
   * Handle game reset request
   * @pre: none
   * @post: all modules reset to initial state
   * @delegates: all module resets
   */
  handleReset(): void

  /**
   * Subscribe to game events
   * @pre: handler is valid function
   * @post: handler will receive all game events
   */
  addEventListener(eventType: string, handler: EventHandler): void

  /**
   * Get current game status
   * @pre: none
   * @post: returns summary of game state
   */
  getGameStatus(): GameStatus
}
```

### Events Emitted

- `GameInitializedEvent`
- All events from delegated operations

### Events Consumed

- UI interaction events
- All game state events

---

## Error Case Definitions

### Common Error Types

```typescript
enum ErrorCode {
  // Placement errors
  SHIP_OUT_OF_BOUNDS = 'SHIP_OUT_OF_BOUNDS',
  SHIP_OVERLAP = 'SHIP_OVERLAP',
  SHIP_ALREADY_PLACED = 'SHIP_ALREADY_PLACED',
  INVALID_SHIP_ID = 'INVALID_SHIP_ID',
  
  // Game state errors
  INVALID_PHASE = 'INVALID_PHASE',
  NOT_YOUR_TURN = 'NOT_YOUR_TURN',
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  GAME_ALREADY_ENDED = 'GAME_ALREADY_ENDED',
  
  // Guess errors
  CELL_ALREADY_GUESSED = 'CELL_ALREADY_GUESSED',
  INVALID_COORDINATE = 'INVALID_COORDINATE',
  
  // System errors
  NO_VALID_MOVES = 'NO_VALID_MOVES',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED'
}

class GameError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public context?: any
  ) {
    super(message);
  }
}


## Contract Consistency Patterns

1. **Method Naming**:
    
    - Actions: `handleX`, `executeX`
    - Queries: `isX`, `hasX`, `getX`
    - State changes: `reset`, `update`
2. **Return Values**:
    
    - Queries return data or boolean
    - Commands return void or result object
    - Async operations return Promise
3. **Error Handling**:
    
    - Invalid preconditions throw errors
    - User errors emit error events
    - System errors throw with context
4. **Event Patterns**:
    
    - Past tense for completed actions
    - Include all relevant context
    - Timestamp on all events
