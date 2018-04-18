// @flow
import { curry, memoize, omit, path, pluck, prop } from 'ramda';

export const keyExtractor = prop('id');

function normalizePath(edgesPath: string): Array<string> {
  const accessor = edgesPath.split('.');

  return accessor[accessor.length - 1] === 'edges'
    ? accessor
    : [...accessor, 'edges'];
}

/**
 * Map edges to prop
 *
 * Convert edges structure to an array of objects (nodes).
 *
 * @type {Function}
 * @param {String} edgePath A dot-path to the edges (e.g `viewer.user.favorites`, `edges` suffix is optional)
 * @param {String} propName Name of the prop to map edges to
 *
 * @returns {Function} Function that takes a data object. mapEdgesToProp is curried so you can pass it directly.
 */
export const mapEdgesToProp = curry(
  (edgePath: string, propName: string, dataObj: any) => {
    // TODO: better check if we're passing a destructured data or not
    const data = dataObj.data ? dataObj.data : dataObj;

    const edges = path(normalizePath(edgePath), data);

    let targetProp;

    if (edges && edges.length) {
      // $FlowFixMe$
      targetProp = pluck('node', edges);
    }

    return {
      data,
      [propName]: targetProp,
    };
  },
);

/**
 * Flattens edges recursively
 *
 * Replaces edges structures with arrays of nodes.
 * @param {Connection} connection
 *
 * @type {Function}
 */
export const flattenEdges = memoize((connection: ?Object) => {
  if (!connection) {
    return [];
  }

  const edges = prop('edges', connection);

  if (!edges || !edges.length) {
    return [];
  }

  return pluck('node', edges).map(node => {
    Object.keys(node).forEach(key => {
      if (path([key, 'edges'], node)) {
        // eslint-disable-next-line no-param-reassign
        node[key] = flattenEdges(prop(key, node));
      }
    });

    return omit('edges', node);
  });
});
