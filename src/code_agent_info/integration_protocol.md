# Battleship Game Integration Protocol

## Module Initialization Order

### Phase 1: Core Infrastructure

```typescript
// 1. Create Event Bus (singleton)
const eventBus = new EventBus();

// 2. Initialize pure domain entities (no dependencies)
const playerBoard = new GameBoard();
const computerBoard = new GameBoard();
const gameState = new GameState();
```

### Phase 2: Domain Layer

```typescript
// 3. Create ships for both fleets
const createShips = () => ({
  carrier: new Ship('carrier', 5),
  battleship: new Ship('battleship', 4),
  destroyer: new Ship('destroyer', 3),
  submarine: new Ship('submarine', 3),
  patrol: new Ship('patrol', 2)
});

// 4. Initialize fleets with boards
const playerFleet = new Fleet('player', playerBoard, createShips());
const computerFleet = new Fleet('computer', computerBoard, createShips());

// 5. Initialize AI Strategy
const aiStrategy = new AIStrategy();
```

### Phase 3: UI Layer

```typescript
// 6. Initialize UI components
const uiRenderer = new UIRenderer(eventBus);
const dragDropController = new DragDropController(eventBus);

// 7. Set up DOM references
uiRenderer.initialize({
  playerBoardElement: document.getElementById('player-board'),
  computerBoardElement: document.getElementById('computer-board'),
  messageElement: document.getElementById('game-message'),
  setupPanel: document.getElementById('setup-panel')
});
```

### Phase 4: Controller Layer

```typescript
// 8. Initialize Game Controller with all dependencies
const gameController = new GameController({
  playerFleet,
  computerFleet,
  gameState,
  aiStrategy,
  uiRenderer,
  dragDropController,
  eventBus
});

// 9. Wire up event listeners
gameController.setupEventHandlers();

// 10. Initial render
gameController.initializeGame();
```

## Event Flow Patterns

### Event Bus Design

```typescript
class EventBus {
  private subscribers: Map<string, Set<EventHandler>> = new Map();
  private eventQueue: GameEvent[] = [];
  private isProcessing: boolean = false;

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => this.subscribers.get(eventType)?.delete(handler);
  }

  emit(event: GameEvent): void {
    // Queue events to prevent cascading during event handling
    this.eventQueue.push(event);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private processQueue(): void {
    this.isProcessing = true;
    
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      const handlers = this.subscribers.get(event.type) || new Set();
      
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error handling ${event.type}:`, error);
          this.emit(new ErrorEvent('EVENT_HANDLER_ERROR', error));
        }
      }
    }
    
    this.isProcessing = false;
  }
}
```

### Publisher/Subscriber Matrix

|Publisher|Event|Subscribers|
|---|---|---|
|**Fleet**|ShipPlacedEvent|UIRenderer, GameController|
|**Fleet**|ShipRotatedEvent|UIRenderer, GameController|
|**Fleet**|PlacementInvalidEvent|UIRenderer|
|**GameState**|GameStartedEvent|UIRenderer, GameController|
|**GameState**|TurnChangedEvent|UIRenderer, GameController|
|**GameState**|GameEndedEvent|UIRenderer, GameController|
|**GameState**|GameResetEvent|All modules|
|**GameController**|GuessMadeEvent|UIRenderer, GameState|
|**GameController**|InvalidGuessEvent|UIRenderer|
|**DragDropController**|DragStartedEvent|UIRenderer|
|**DragDropController**|DragUpdatedEvent|UIRenderer|
|**UIRenderer**|VisualFeedbackEvent|(None - for animations)|
|**UIRenderer**|AudioFeedbackEvent|(None - for sound)|

### Event Flow Examples

#### Ship Placement Flow

1. User drags ship
   DragDropController -> DragStartedEvent -> UIRenderer (show ghost)
2. User moves mouse
   DragDropController -> DragUpdatedEvent -> UIRenderer (update ghost)
3. User drops ship
   DragDropController.completeDrop() -> GameController.handleShipPlacement()
   -> Fleet.placeShip() -> ShipPlacedEvent -> UIRenderer (render ship)
4. If invalid placement
   Fleet.placeShip() throws -> GameController catches
   -> PlacementInvalidEvent -> UIRenderer (show error feedback)

#### Game Turn Flow

1. Player clicks target
   UIRenderer (click handler) -> GameController.handlePlayerGuess()
   -> Fleet.recordAttack() -> GuessMadeEvent
   -> UIRenderer (show hit/miss)
   -> GameState.switchTurn() -> TurnChangedEvent
2. Computer turn triggers
   GameController (on TurnChangedEvent) -> executeComputerTurn()
   -> AIStrategy.getNextMove() -> Fleet.recordAttack()
   -> GuessMadeEvent -> UIRenderer (show hit/miss)
   -> GameState.switchTurn() -> TurnChangedEvent
3. If game ends
   Fleet.areAllShipsSunk() -> GameState.endGame()
   -> GameEndedEvent -> UIRenderer (show victory screen)

## Error Propagation Strategy

### Error Boundaries

```typescript
// Level 1: Domain Errors (throw immediately)
class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

// Level 2: User Input Errors (emit as events)
class UserInputError extends Error {
  constructor(
    message: string, 
    public code: string,
    public context: any
  ) {
    super(message);
  }
}

// Level 3: System Errors (log and recover)
class SystemError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean
  ) {
    super(message);
  }
}
```

### Error Handling Patterns

#### Domain Layer (Fleet, Ship, Board)

```typescript
// Throws errors for contract violations
placeShip(shipId: ShipId, x: number, y: number, orientation: Orientation): void {
  const validation = this.validatePlacement(shipId, x, y, orientation);
  
  if (!validation.isWithinBounds) {
    throw new DomainError('Ship placement out of bounds', 'SHIP_OUT_OF_BOUNDS');
  }
  
  if (!validation.hasNoOverlap) {
    throw new DomainError('Ship overlaps with existing ship', 'SHIP_OVERLAP');
  }
  
  // Proceed with placement...
}
```

#### Controller Layer (GameController)

```typescript
// Catches domain errors and emits user-friendly events
handleShipPlacement(shipId: ShipId, x: number, y: number, orientation: Orientation): void {
  try {
    this.playerFleet.placeShip(shipId, x, y, orientation);
  } catch (error) {
    if (error instanceof DomainError) {
      // Convert to user event
      this.eventBus.emit(new PlacementInvalidEvent(
        shipId,
        { x, y },
        error.code as PlacementError
      ));
    } else {
      // Unexpected error - log and emit system error
      console.error('Unexpected error during placement:', error);
      this.eventBus.emit(new SystemErrorEvent(error));
    }
  }
}
```

#### UI Layer (UIRenderer)

```typescript
// Handles all errors gracefully with user feedback
constructor(private eventBus: EventBus) {
  // Subscribe to error events
  eventBus.subscribe('PLACEMENT_INVALID', (event) => {
    this.showErrorFeedback(event.reason);
  });
  
  eventBus.subscribe('SYSTEM_ERROR', (event) => {
    this.showMessage({
      text: 'An error occurred. Please try again.',
      type: 'error'
    });
  });
}

// Wrap all UI operations in try-catch
showHit(coordinate: CellCoordinate, boardId: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const element = this.getCellElement(coordinate, boardId);
      element.classList.add('hit');
      // Animation logic...
      resolve();
    } catch (error) {
      console.error('UI rendering error:', error);
      resolve(); // Don't break game flow
    }
  });
}
```

## State Synchronization Approach

### Single Source of Truth

```typescript
// Game state is the authoritative source
interface AuthoritativeState {
  gamePhase: GamePhase;        // GameState owns this
  currentTurn: PlayerId | null; // GameState owns this
  playerFleet: Fleet;          // Fleet owns ship positions
  computerFleet: Fleet;        // Fleet owns ship positions
  lastAction: GameEvent | null; // Event bus owns this
}
```

### State Update Flow

```typescript
class StateCoordinator {
  // All state changes flow through events
  private handleStateChange(event: GameEvent): void {
    switch (event.type) {
      case 'SHIP_PLACED':
        // Fleet has already updated its state
        // UI reacts to render the change
        this.uiRenderer.renderShip(event.shipId);
        break;
        
      case 'GAME_STARTED':
        // GameState has already updated phase
        // UI reacts to show/hide elements
        this.uiRenderer.toggleSetupUI(false);
        this.uiRenderer.renderBoard(this.computerBoard, false, 'computer-board');
        break;
        
      case 'GUESS_MADE':
        // Board has already recorded the guess
        // UI reacts to show result
        if (event.result.hit) {
          this.uiRenderer.showHit(event.target, event.playerId);
        } else {
          this.uiRenderer.showMiss(event.target, event.playerId);
        }
        break;
    }
  }
}
```

### Preventing State Desync

1. **No Direct State Mutation**: All changes go through method calls that emit events
2. **Event Ordering**: EventBus queues ensure consistent ordering
3. **Atomic Operations**: State changes are atomic within each module
4. **Recovery Mechanism**: Reset event brings all modules to known state

```typescript
// Example: Atomic state update in GameState
switchTurn(): void {
  const previousPlayer = this.currentTurn;
  
  // Atomic update
  this.currentTurn = this.currentTurn === 'player' ? 'computer' : 'player';
  this.turnNumber++;
  
  // Emit event after state is consistent
  this.eventBus.emit(new TurnChangedEvent(
    previousPlayer!,
    this.currentTurn,
    this.turnNumber
  ));
}
```

## Validation Results

### ✅ All Interactions Implementable

- Each interaction maps to a clear method chain
- Event flow supports all UI feedback requirements
- Error cases have defined handling paths

### ✅ No Circular Dependencies

- Dependency graph is acyclic (verified in module boundaries)
- Event bus prevents direct circular references
- Clear hierarchy: Controller → Domain → Data

### ✅ Clear Error Boundaries

- Domain layer: Throws for programming errors
- Controller layer: Catches and converts to events
- UI layer: Always recovers gracefully
- Event handlers: Isolated error handling

## Integration Testing Strategy

```typescript
// Integration test example
describe('Ship Placement Integration', () => {
  it('should handle complete placement flow', async () => {
    const events: GameEvent[] = [];
    eventBus.subscribe('*', (e) => events.push(e));
    
    // Simulate drag and drop
    dragDropController.startDrag('carrier', { x: 0, y: 0 });
    dragDropController.updateDragPosition({ x: 50, y: 50 });
    const placement = dragDropController.completeDrop();
    
    // Trigger placement
    gameController.handleShipPlacement(
      placement.shipId,
      placement.position.x,
      placement.position.y,
      placement.orientation
    );
    
    // Verify event sequence
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'DRAG_STARTED' })
    );
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'SHIP_PLACED' })
    );
    
    // Verify final state
    expect(playerFleet.getShipAt('2,2')).toBeDefined();
  });
});
```
