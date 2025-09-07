class SimpleEmitter {
  constructor() {
    this._map = new Map(); // {eventName -> Set<handler>}
  }

  addListener(eventName, handler) { 
    if (!this._map.has(eventName)) this._map.set(eventName, new Set());
    this._map.get(eventName).add(handler);
  }

  removeListener(eventName, handler) { 
    const set = this._map.get(eventName);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this._map.delete(eventName);
  }

  emit(eventName, payload) {
    const set = this._map.get(eventName);
    if (!set) return;
    [...set].forEach(fn => {
      try { fn(payload); } catch (e) { console.error(e); }
    });
  }

  on(eventName, handler)  { this.addListener(eventName, handler); }
  off(eventName, handler) { this.removeListener(eventName, handler); }
}

export const bankEvents = new SimpleEmitter();
