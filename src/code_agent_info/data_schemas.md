# Battleship Game Schema Synthesis

## Entity Schemas

### Ship

```typescript
interface Ship {
  id: ShipId;
  length: 1 | 2 | 3 | 4 | 5;
  position: Position | null;
  orientation: Orientation;
  hitCells: Set<CellCoordinate>;
  
  // Derived properties
  isPlaced: boolean;
  isSunk: boolean;
  occupiedCells: CellCoordinate[];
}

type ShipId = 'carrier' | 'battleship' | 'destroyer' | 'submarine' | 'patrol';
```

### GameBoard

```typescript
interface GameBoard {
  width: 10;
  height: 10;
  cells: Cell[][];
  
  // Indexed lookups
  shipPositions: Map<CellCoordinate, ShipId>;
  guessHistory: Set<CellCoordinate>;
}

interface Cell {
  coordinate: CellCoordinate;
  state: CellState;
  occupant: ShipId | null;
}

type CellState = 
  | 'empty'
  | 'occupied'
  | 'hit'
  | 'miss';
```

### Fleet

```typescript
interface Fleet {
  playerId: PlayerId;
  ships: Map<ShipId, Ship>;
  board: GameBoard;
  
  // Aggregate state
  placedShipCount: number;
  remainingShipCount: number;
  isDefeated: boolean;
}

type PlayerId = 'player' | 'computer';
```

### AIStrategy

```typescript
interface AIStrategy {
  mode: TargetingMode;
  lastHit: CellCoordinate | null;
  hitQueue: CellCoordinate[];
  attemptedCells: Set<CellCoordinate>;
  
  // Pattern tracking
  currentTargetShip: {
    hits: CellCoordinate[];
    orientation: Orientation | 'unknown';
  } | null;
}

type TargetingMode = 'random' | 'hunting' | 'sinking';
```

## Value Objects (Immutable Types)

### Position

```typescript
interface Position {
  readonly x: number;
  readonly y: number;
}
```

### CellCoordinate

```typescript
type CellCoordinate = `${number},${number}`; // "3,5" format for easy comparison

// Helper functions
function toCoordinate(x: number, y: number): CellCoordinate;
function fromCoordinate(coord: CellCoordinate): Position;
```

### Orientation

```typescript
type Orientation = 'horizontal' | 'vertical';
```

### GamePhase

```typescript
type GamePhase = 'setup' | 'gameplay' | 'endgame';
```

### TurnState

```typescript
interface TurnState {
  readonly currentPlayer: PlayerId | null;
  readonly turnNumber: number;
}
```

### PlacementAttempt

```typescript
interface PlacementAttempt {
  readonly shipId: ShipId;
  readonly position: Position;
  readonly orientation: Orientation;
}
```

### GuessAttempt

```typescript
interface GuessAttempt {
  readonly playerId: PlayerId;
  readonly target: CellCoordinate;
  readonly timestamp: number;
}
```

## State Schemas

### GameState

```typescript
interface GameState {
  phase: GamePhase;
  turn: TurnState;
  playerFleet: Fleet;
  computerFleet: Fleet;
  winner: PlayerId | null;
  startTime: number | null;
  endTime: number | null;
}
```

### UIState

```typescript
interface UIState {
  dragState: DragState | null;
  highlightedCells: Set<CellCoordinate>;
  selectedShip: ShipId | null;
  visibleBoards: {
    player: boolean;
    computer: boolean;
  };
  activeAnimations: Animation[];
  message: StatusMessage | null;
}

interface DragState {
  shipId: ShipId;
  ghostPosition: Position;
  validPlacement: boolean;
  affectedCells: CellCoordinate[];
}

interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning';
}
```

## Event Schemas

### Setup Phase Events

```typescript
interface ShipPlacedEvent {
  type: 'SHIP_PLACED';
  shipId: ShipId;
  position: Position;
  orientation: Orientation;
  affectedCells: CellCoordinate[];
  timestamp: number;
}

interface ShipRotatedEvent {
  type: 'SHIP_ROTATED';
  shipId: ShipId;
  previousOrientation: Orientation;
  newOrientation: Orientation;
  affectedCells: {
    cleared: CellCoordinate[];
    occupied: CellCoordinate[];
  };
  timestamp: number;
}

interface PlacementInvalidEvent {
  type: 'PLACEMENT_INVALID';
  shipId: ShipId;
  attemptedPosition: Position;
  reason: PlacementError;
  timestamp: number;
}

type PlacementError = 
  | 'OUT_OF_BOUNDS'
  | 'OVERLAP_DETECTED'
  | 'ALREADY_PLACED';
```

### Gameplay Phase Events

```typescript
interface GameStartedEvent {
  type: 'GAME_STARTED';
  firstPlayer: PlayerId;
  timestamp: number;
}

interface GuessMadeEvent {
  type: 'GUESS_MADE';
  playerId: PlayerId;
  target: CellCoordinate;
  result: GuessResult;
  timestamp: number;
}

interface GuessResult {
  hit: boolean;
  shipId: ShipId | null;
  shipSunk: boolean;
  coordinates: CellCoordinate;
}

interface TurnChangedEvent {
  type: 'TURN_CHANGED';
  previousPlayer: PlayerId;
  nextPlayer: PlayerId;
  turnNumber: number;
  timestamp: number;
}

interface InvalidGuessEvent {
  type: 'INVALID_GUESS';
  playerId: PlayerId;
  target: CellCoordinate;
  reason: 'NOT_YOUR_TURN' | 'ALREADY_GUESSED';
  timestamp: number;
}
```

### Endgame Phase Events

```typescript
interface GameEndedEvent {
  type: 'GAME_ENDED';
  winner: PlayerId;
  loser: PlayerId;
  finalScore: {
    winnerShipsRemaining: number;
    totalTurns: number;
    duration: number;
  };
  timestamp: number;
}

interface GameResetEvent {
  type: 'GAME_RESET';
  previousPhase: GamePhase;
  timestamp: number;
}
```

### UI Feedback Events

```typescript
interface VisualFeedbackEvent {
  type: 'VISUAL_FEEDBACK';
  feedbackType: FeedbackType;
  location: CellCoordinate | Position;
  duration: number;
  timestamp: number;
}

type FeedbackType = 
  | 'HIT_EXPLOSION'
  | 'MISS_SPLASH'
  | 'SHIP_SUNK'
  | 'INVALID_PLACEMENT'
  | 'VALID_DROP_ZONE';

interface AudioFeedbackEvent {
  type: 'AUDIO_FEEDBACK';
  sound: SoundEffect;
  timestamp: number;
}

type SoundEffect = 
  | 'SHIP_PLACED'
  | 'HIT'
  | 'MISS'
  | 'SHIP_SUNK'
  | 'VICTORY'
  | 'DEFEAT';
```

## Validation Schemas

### PlacementValidation

```typescript
interface PlacementValidation {
  isWithinBounds: boolean;
  hasNoOverlap: boolean;
  shipNotAlreadyPlaced: boolean;
  
  // Detailed validation results
  outOfBoundsCells: CellCoordinate[];
  overlappingCells: CellCoordinate[];
}


### GuessValidation

```typescript
interface GuessValidation {
  isPlayerTurn: boolean;
  cellNotPreviouslyGuessed: boolean;
  gameInProgress: boolean;
  
  // Context for error messages
  currentTurn: PlayerId | null;
  cellState: CellState;
}
```

### GameStartValidation

```typescript
interface GameStartValidation {
  allShipsPlaced: boolean;
  validPlacements: boolean;
  
  // Detailed state
  placedShips: ShipId[];
  missingShips: ShipId[];
  invalidPlacements: Array<{
    shipId: ShipId;
    reason: PlacementError;
  }>;
}
```

## Derived State Helpers

```typescript
// Computed properties that can be derived from base schemas
interface ComputedGameState {
  isSetupComplete: boolean;
  isGameActive: boolean;
  currentPlayerShipsRemaining: number;
  opponentShipsRemaining: number;
  validGuessTargets: Set<CellCoordinate>;
  turnHistory: GuessAttempt[];
}

// UI-specific computed state
interface ComputedUIState {
  availableShipsForPlacement: ShipId[];
  isDragging: boolean;
  canStartGame: boolean;
  isWaitingForTurn: boolean;
  shouldShowResetButton: boolean;
}
```
