export class LowPassFilter {
  #initialized = false;

  #rawValue;

  #storedValue;

  #alpha;

  constructor(alpha) {
    this.#alpha = alpha;
  }

  apply(value) {
    let result;
    if (this.#initialized) {
      result = this.#alpha * value + (1 - this.#alpha) * this.#storedValue;
    } else {
      result = value;
      this.#initialized = true;
    }
    this.#rawValue = value;
    this.#storedValue = result;

    return result;
  }

  applyWithAlpha(value, alpha) {
    this.#alpha = alpha;
    return this.apply(value);
  }

  get lastRawValue() {
    return this.#rawValue;
  }
}
