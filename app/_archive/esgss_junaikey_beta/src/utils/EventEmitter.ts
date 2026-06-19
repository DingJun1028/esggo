/**
 * 🎭 EventEmitter Mock for Browser
 * --------------------------------------------------
 * Dedicated mock for 'events' module to satisfy imports
 * expecting the class as default export.
 */

export class EventEmitter {
  private _listeners: Record<string, ((...args: any[]) => void)[]> = {};
  static defaultMaxListeners = 10;

  constructor() {
    this._listeners = {};
  }

  on(event: string, fn: (...args: any[]) => void) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return this;
  }

  off(event: string, fn: (...args: any[]) => void) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
    return this;
  }

  once(event: string, fn: (...args: any[]) => void) {
    const onceFn = (...args: any[]) => {
      this.off(event, onceFn);
      fn.apply(this, args);
    };
    return this.on(event, onceFn);
  }

  emit(event: string, ...args: any[]) {
    if (!this._listeners[event]) return false;
    this._listeners[event].forEach((fn) => fn.apply(this, args));
    return true;
  }

  addListener(event: string, fn: (...args: any[]) => void) {
    return this.on(event, fn);
  }

  removeListener(event: string, fn: (...args: any[]) => void) {
    return this.off(event, fn);
  }

  removeAllListeners(event?: string) {
    if (event) delete this._listeners[event];
    else this._listeners = {};
    return this;
  }

  setMaxListeners(n: number) {
    return this;
  }

  getMaxListeners() {
    return EventEmitter.defaultMaxListeners;
  }

  listeners(event: string) {
    return this._listeners[event] || [];
  }

  rawListeners(event: string) {
    return this._listeners[event] || [];
  }

  listenerCount(event: string) {
    return (this._listeners[event] || []).length;
  }
}

export default EventEmitter;
