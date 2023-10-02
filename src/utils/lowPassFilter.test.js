import { LowPassFilter } from './lowPassFilter';

describe('LowPassFilter', () => {
  it('should not be initialized on construction', () => {
    const filter = new LowPassFilter(0.5);

    expect(filter.lastRawValue).toBeUndefined();
  });

  it('should initialize after first apply', () => {
    const filter = new LowPassFilter(0.5);

    const result = filter.apply(2);

    expect(result).toEqual(2);
    expect(filter.lastRawValue).toEqual(2);
  });

  it('apply should store new value as raw', () => {
    const filter = new LowPassFilter(0.5);

    filter.apply(2);

    filter.apply(4);

    expect(filter.lastRawValue).toEqual(4);
  });

  it('should calculate new filtered value on apply', () => {
    const filter = new LowPassFilter(0.5);

    filter.apply(2);

    const result = filter.apply(4);

    expect(result).toEqual(3); // 0.5 * 4 + 0.5 * 2
  });

  it('#applyWithAlpha should use new alpha', () => {
    const filter = new LowPassFilter(1.0);
    filter.apply(2);

    let result = filter.applyWithAlpha(4, 1);
    expect(result).toEqual(4);

    result = filter.applyWithAlpha(3, 0.5);

    expect(result).toEqual(3.5); // 0.5 * 3 + 0.5 * 4
  });
});
