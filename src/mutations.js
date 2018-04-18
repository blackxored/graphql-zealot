// @flow
import { curry } from 'ramda';
import { cursorForObjectInConnection } from './connection';

/**
 * Add edge to a mutation result
 *
 * Shape:
 * {
 *   edge: {
 *     node: result
 *   }
 * }
 *
 * @param response
 * @returns {{edge: {node: any}}}
 */
export const addEdgeToMutationResult = (response: any) => {
  // TODO: cursors?
  return {
    edge: {
      node: response,
    },
  };
};

/**
 * Add both edge and cursor to a mutation result
 * Cursor is calculated via `cursorForObjectInConnection`.
 *
 * @type {Function}
 * @param {Function} connectionGetter Function that returns a promise of a Connection of all records
 * @param {Object} obj The current object
 */
export const addEdgeAndCursorToMutationResult = curry(
  (connectionGetter: () => Promise<*>, obj: Object) => {
    return connectionGetter().then(connection => {
      return {
        edge: {
          node: obj,
          cursor: cursorForObjectInConnection(connection, obj),
        },
      };
    });
  },
);

/**
 * Generate an optimistic response
 *
 * @param {String} operationName The name of the mutation that was run
 * @param {String} payloadName The name of the payload in the response object
 * @param {Object} response Partial response for the object that's to be returned by the server
 *
 * @returns {Function} function that takes variables and can be passed to Apollo's `optimisticResponse`
 *
 * @type {Function}
 */
export const optimisticResponse = curry(
  (
    operationName: string,
    payloadName: string,
    response: Object => Object,
    variables: Object,
  ) => {
    const result =
      typeof response === 'function' ? response(variables) : response;

    return {
      __typename: 'Mutation',
      [operationName]: {
        __typename: payloadName,
        ...result,
      },
    };
  },
);
