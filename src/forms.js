// @flow
import { memoize, omit } from 'ramda';

/**
 * Return values for `obj` ommiting `id` and `__typename`.
 */
export const formValues = memoize((obj: Object) => {
  return omit(['id', '__typename'], obj);
});
