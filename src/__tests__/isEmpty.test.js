import { isEmpty, isEmptyProp, isEmptyPath } from '../isEmpty';

describe('isEmpty', () => {
  it('returns true if a collection is empty', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it('returns true if the passed value is undefined', () => {
    expect(isEmpty()).toBe(true);
  });

  it('return false if the passed value is not undefined', () => {
    expect(isEmpty(6)).toBe(false);
  });

  it('returns false if passed a collection with at least one item', () => {
    expect(isEmpty([1])).toBe(false);
  });
});

describe('isEmptyProp', () => {
  it('runs isEmpty on a property of the object passed', () => {
    expect(isEmptyProp('items', { items: [] })).toBe(true);
    expect(isEmptyProp('items', { items: [1] })).toBe(false);
  });
});

describe('isEmptyPath', () => {
  it('runs isEmpty on a path of the object passed', () => {
    const empty = { items: { relation: [] } };
    const notEmpty = { items: { relation: [1] } };
    const path = ['items', 'relation'];

    expect(isEmptyPath(path, empty)).toBe(true);
    expect(isEmptyPath(path, notEmpty)).toBe(false);
  });
});
