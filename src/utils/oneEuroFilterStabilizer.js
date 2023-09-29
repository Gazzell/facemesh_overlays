import { OneEuroFilter } from './oneEuroFilter';

export class OneEuroFilterStabilizer {
  keypoints = null;

  #beta;

  #cutoff;

  #derivateCutoff;

  reset(beta, cutoff, derivateCutoff) {
    this.keypoints = null;
    this.#beta = beta;
    this.#cutoff = cutoff;
    this.#derivateCutoff = derivateCutoff;
  }

  #init(keypoints) {
    const size = keypoints.length * 3;

    this.keypoints = [];

    for (let i = 0; i < size; i++) {
      this.keypoints.push(new OneEuroFilter(this.#beta, this.#cutoff, this.#derivateCutoff));
    }
  }

  apply(keypoints, elapsedTime) {
    if (!this.keypoints) {
      this.#init(keypoints);
    }

    return keypoints.map(({ x, y, z }, index) => ({
      x: this.keypoints[index * 3].apply(x, elapsedTime),
      y: this.keypoints[index * 3 + 1].apply(y, elapsedTime),
      z: this.keypoints[index * 3 + 2].apply(z, elapsedTime),
    }));
  }
}
