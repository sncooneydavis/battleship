/* eslint-disable import/prefer-default-export */
import { EventEmitter } from 'node:events';

class DragDropController {
  constructor(emitter = new EventEmitter()) {
    this.emitter = emitter;
    this.dragState = null;
  }

  isDragging() {
    return this.dragState !== null;
  }

  startDrag(shipId, mousePosition) {
    if (this.isDragging()) throw new Error('INVALID_STATE');
    this.dragState = {
      shipId,
      ghostPosition: { x: mousePosition.x, y: mousePosition.y },
      validPlacement: false,
      affectedCells: [],
    };
    this.emitter.emit('DRAG_STARTED', {
      type: 'DRAG_STARTED',
      shipId,
      startPosition: { x: mousePosition.x, y: mousePosition.y },
      timestamp: Date.now(),
    });
  }

  updateDragPosition(mousePosition, board) {
    if (!this.isDragging()) throw new Error('INVALID_STATE');
    this.dragState.ghostPosition = { x: mousePosition.x, y: mousePosition.y };

    if (board && typeof board.isValidPosition === 'function') {
      // Use minimal check: treat ship as length 1 horizontal for preview validity
      this.dragState.validPlacement = board.isValidPosition(
        mousePosition.x,
        mousePosition.y,
        1,
        'horizontal'
      );
      this.dragState.affectedCells = this.dragState.validPlacement
        ? board.getOccupiedCells(
            mousePosition.x,
            mousePosition.y,
            1,
            'horizontal'
          )
        : [];
    } else {
      this.dragState.validPlacement = true;
      this.dragState.affectedCells = [];
    }

    this.emitter.emit('DRAG_UPDATED', {
      type: 'DRAG_UPDATED',
      shipId: this.dragState.shipId,
      ghostPosition: this.dragState.ghostPosition,
      valid: this.dragState.validPlacement,
      timestamp: Date.now(),
    });
  }

  canDropAt(x, y) {
    if (!this.isDragging()) throw new Error('INVALID_STATE');
    const { ghostPosition, validPlacement } = this.dragState;
    return validPlacement && ghostPosition.x === x && ghostPosition.y === y;
  }

  completeDrop() {
    if (!this.isDragging()) throw new Error('INVALID_STATE');
    if (!this.dragState.validPlacement) throw new Error('DROP_INVALID');
    const { shipId, ghostPosition } = this.dragState;
    this.dragState = null;
    return {
      shipId,
      position: { ...ghostPosition },
      orientation: 'horizontal',
    };
  }

  cancelDrag() {
    if (!this.isDragging()) throw new Error('INVALID_STATE');
    const { shipId } = this.dragState;
    this.dragState = null;
    this.emitter.emit('DRAG_CANCELLED', {
      type: 'DRAG_CANCELLED',
      shipId,
      timestamp: Date.now(),
    });
  }
}

export { DragDropController };
