/* eslint-disable no-restricted-syntax */
class EventBus {
  constructor() {
    this.subscribers = new Map();
    this.eventQueue = [];
    this.isProcessing = false;
  }

  subscribe(eventType, handler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const handlers = this.subscribers.get(eventType);
    handlers.add(handler);
    return () => handlers.delete(handler);
  }

  emit(event) {
    this.eventQueue.push(event);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    this.isProcessing = true;
    while (this.eventQueue.length > 0) {
      const evt = this.eventQueue.shift();
      const handlers = this.subscribers.get(evt.type) || new Set();
      for (const handler of handlers) {
        try {
          handler(evt);
        } catch (error) {
          if (evt.type !== 'SYSTEM_ERROR') {
            this.emit({ type: 'SYSTEM_ERROR', error, timestamp: Date.now() });
          }
        }
      }
    }
    this.isProcessing = false;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { EventBus };
