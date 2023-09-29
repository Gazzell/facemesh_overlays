import { LowPassFilter } from './lowPassFilter';

const BETA = 0.1;
const MIN_CUTOFF = 0.2;
const DERIVATE_CUTOFF = 5;

export class OneEuroFilter {
  #frequency;

  #x;

  #dx;

  #beta;

  #minCutoff;

  #derivateCutoff;

  /**
   * Constructor of `OneEuroFilter` class.
   * @param config See documentation of `OneEuroFilterConfig`.
   */
  constructor(beta = BETA, minCutoff = MIN_CUTOFF, derivateCutoff = DERIVATE_CUTOFF) {
    this.#frequency = 0;
    this.#beta = beta;
    this.#minCutoff = minCutoff;
    this.#derivateCutoff = derivateCutoff;
    this.#x = new LowPassFilter(this.#getAlpha(this.#minCutoff));
    this.#dx = new LowPassFilter(this.#getAlpha(this.#derivateCutoff));
  }

  /**
   * Applies filter to the value.
   * @param value valueToFilter.
   * @param elapsedTime millis from previous frame.
   */
  apply(value, elapsedTime) {
    if (value == null) {
      return value;
    }

    this.#frequency = 1 / (elapsedTime * 0.001);

    // Estimate the current variation per second.
    const dValue = this.#x.lastRawValue !== undefined ? (value - this.#x.lastRawValue) * this.#frequency : 0;
    const edValue = this.#dx.applyWithAlpha(dValue, this.#getAlpha(this.#derivateCutoff));
    const cutOff = this.#minCutoff + this.#beta * Math.abs(edValue);

    // filter the given value.
    return this.#x.applyWithAlpha(value, this.#getAlpha(cutOff));
  }

  #getAlpha(cutoff) {
    // te = 1.0 / this.#frequency
    // tau = 1.0 / (2 * Math.PI * cutoff)
    // result = 1 / (1.0 + (tau / te))
    return 1.0 / (1.0 + this.#frequency / (2 * Math.PI * cutoff));
  }
}
