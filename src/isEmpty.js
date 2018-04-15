// @flow
import {
  curry,
  curryN,
  either,
  isEmpty as isEmptyOrig,
  isNil,
  path,
  prop,
} from 'ramda';

/**
 * Returns true whether the arguments is nil or and empty string
 *
 * @see Ramda's isEmpty
 * @type {Function}
 */
export const isEmpty = curryN(0, arg => either(isNil, isEmptyOrig)(arg));

/**
 * Returns whether a prop `isEmpty`
 * @type {Function}
 */
export const isEmptyProp = curry((propName: string, props: Object) => {
  return isEmpty(prop(propName, props));
});

/**
 * Returns whether the given Ramda path `isEmpty`
 * @type {Function}
 */
export const isEmptyPath = curry((pathArray: Array<string>, props: Object) => {
  return isEmpty(path(pathArray, props));
});
