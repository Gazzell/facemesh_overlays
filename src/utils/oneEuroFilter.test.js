import { OneEuroFilter } from './oneEuroFilter';

describe('OneEuroFilter', () => {
  it('should return the passed value on first apply', () => {
    const filter = new OneEuroFilter();

    const result = filter.apply(3);

    expect(result).toEqual(3);
  });

  it('outputs are in convex hull of inputs', () => {
    const filter = new OneEuroFilter(20.2, 15.5, 21.5);
    const value0 = -1.0;
    const delta0 = 0;

    const value1 = 2.0;
    const delta1 = 15;

    const value2 = -3.0;
    const delta2 = 33;

    const output0 = filter.apply(value0, delta0);
    expect(output0).toEqual(value0);

    const output1 = filter.apply(value1, delta1);
    expect(output1).toBeLessThan(Math.max(value0, value1));
    expect(output1).toBeGreaterThan(Math.min(value0, value1));

    const output2 = filter.apply(value2, delta2);
    expect(output2).toBeLessThan(Math.max(value0, value1, value2));
    expect(output2).toBeGreaterThan(Math.min(value0, value1, value2));
  });
});
