// @flow
import { curry, memoize, omit, path, pluck, prop } from 'ramda';

export const keyExtractor = prop('id');

function normalizePath(edgesPath: string): Array<string> {
  const accessor = edgesPath.split('.');

  return accessor[accessor.length - 1] === 'edges'
    ? accessor
    : [...accessor, 'edges'];
}

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
