import { OneEuroFilterStabilizer } from './oneEuroFilterStabilizer';

const initialPoints = [
  { x: 1, y: 1, z: 1 },
  { x: 2, y: 2, z: 2 },
];

const newPoints = [
  { x: 1.5, y: 1.5, z: 1.5 },
  { x: 2.5, y: 2.5, z: 1.5 },
];

describe('OneEuroFilterStabilizer', () => {
  it('should return same points on first apply', () => {
    const stabilizer = new OneEuroFilterStabilizer();

    expect(stabilizer.apply(initialPoints, 0)).toEqual(initialPoints);
  });

  it('should return new calculated points in subsequent applies', () => {
    const stabilizer = new OneEuroFilterStabilizer();

    stabilizer.apply(initialPoints, 0);
    const newCalculatedPoints = stabilizer.apply(newPoints, 15);

    expect(newCalculatedPoints).not.toEqual(newPoints);
  });

  it('reset should change filter parameters', () => {
    const stabilizer = new OneEuroFilterStabilizer();

    stabilizer.apply(initialPoints, 0);
    const newCalculatedPoints0 = stabilizer.apply(newPoints, 15);

    const stabilizer1 = new OneEuroFilterStabilizer();

    stabilizer1.reset(0.1, 0.9, 0.1);
    stabilizer1.apply(initialPoints, 0);
    const newCalculatedPoints1 = stabilizer1.apply(newPoints, 15);

    expect(newCalculatedPoints0).not.toEqual(newCalculatedPoints1);
  });
});
