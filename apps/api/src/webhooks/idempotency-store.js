class InMemoryIdempotencyStore {
  constructor() {
    this.keys = new Set();
  }

  claim(key) {
    if (this.keys.has(key)) return false;
    this.keys.add(key);
    return true;
  }
}

module.exports = { InMemoryIdempotencyStore };
