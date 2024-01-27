type Event<F = (...args: any[]) => void> = {
  hook: F;
};

export default class Events<T extends Record<string, Event>> {
  private listeners: Record<string, Set<Event['hook']>> = {};
  private onceMap: Map<Event['hook'], boolean> = new Map();

  /**
   * Executes function when events happens
   *
   * @param on Name of event
   * @param hook Function to run
   */
  on<K extends keyof T>(eventName: K, hook: T[K]['hook']) {
    const key = String(eventName);
    this.listeners[key] = this.listeners[key] || new Set<Event['hook']>();
    this.listeners[key].add(hook);
    this.onceMap.set(hook, false);

    return this;
  }

  /**
   * Executes function when events happens, will only run once
   *
   * @param on Name of event
   * @param hook Function to run
   */
  once<K extends keyof T>(eventName: K, hook: T[K]['hook']) {
    this.on(eventName, hook);
    this.onceMap.set(hook, true);

    return this;
  }

  /**
   * Deregisters functions from executing when events happens
   *
   * @param on Name of event
   * @param hook Function to run
   */
  off<K extends keyof T>(eventName: K, hook: T[K]['hook']) {
    const key = String(eventName);
    this.listeners[key] = this.listeners[key] || new Set<Event['hook']>();
    this.listeners[key].delete(hook);
    this.onceMap.delete(hook);
  }

  /**
   * Remove all listeners for event
   *
   * @param on Name of event
   */
  removeAllListeners(eventName: keyof T) {
    const key = String(eventName);

    if (this.listeners[key]) {
      // clear once map for this event
      this.listeners[key].forEach((listener) => {
        this.onceMap.delete(listener);
      });

      this.listeners[key].clear();
    }
  }

  /**
   * Removes all listeners for all events on this object
   *
   * @param on Name of event
   * @param hook Function to run
   */
  resetEvents() {
    Object.keys(this.listeners).forEach((key) => {
      this.listeners[key].clear();
    });

    this.onceMap.clear();
  }

  /**
   * Trigger all listeners on an event
   *
   * @param on Name of event
   * @param args Data to pass to listeners
   */
  trigger<K extends keyof T>(eventName: K, ...args: Parameters<T[K]['hook']>) {
    const key = String(eventName);
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => {
        listener(...args);

        // if only there to be triggered once, delete it from listeners
        if (this.onceMap.get(listener)) {
          this.listeners[key].delete(listener);
          this.onceMap.delete(listener);
        }
      });
    }
  }
}
