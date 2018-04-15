import { isUUID } from '../isOptimistic';

const uuid = '49b42448-5844-41e1-9a3a-369774c9ceb6';

describe('isUUID', () => {
  it('returns true if the given string is a valid UUID', () => {
    expect(isUUID(uuid)).toBe(true);
  });

  it('returns false if the given strring is not a valid UUID', () => {
    expect(isUUID('foo')).toBe(false);
  });
});
