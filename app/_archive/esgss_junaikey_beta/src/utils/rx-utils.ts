// Simple BehaviorSubject implementation for state management
export type Subscriber<T> = (value: T) => void;
export type Unsubscribe = () => void;

export interface Observable<T> {
  subscribe(callback: Subscriber<T>): Unsubscribe;
}

export class BehaviorSubject<T> implements Observable<T> {
  private value: T;
  private subscribers: Set<Subscriber<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  next(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.subscribers.forEach(sub => sub(this.value));
    }
  }

  subscribe(callback: Subscriber<T>): Unsubscribe {
    this.subscribers.add(callback);
    callback(this.value); // Emit current value immediately
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

export const behaviorSubject = <T>(initialValue: T) => new BehaviorSubject<T>(initialValue);
