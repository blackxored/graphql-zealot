// @flow
import {
  find,
  findIndex,
  lensIndex,
  lensPath,
  pathEq,
  propEq,
  set,
  view,
} from 'ramda';
import {
  cursorForObjectInConnection as cursorForObjectInConnectionOrig,
  offsetToCursor,
} from 'graphql-relay';

export type Edge = {
  node: Object,
};

export type Connection = {
  cursor?: string,
  edges: Array<?Edge>,
};

const findEdgeIndex = (id, edges) => {
  return findIndex(pathEq(['node', 'id'], id), edges);
};

/**
 * Replaces an edge in a list
 *
 * @param data
 * @param edgePath
 * @param edge
 * @returns {*}
 */
export const replaceEdge = (
  data: any,
  edgePath: Array<string>,
  edge: Object,
) => {
  // $FlowFixMe$
  const edgesPath = lensPath(edgePath);
  const oldEdges = view(edgesPath, data);
  const edgeIndex = findEdgeIndex(edge.node.id, oldEdges);
  const indexLens = lensIndex(edgeIndex);

  if (edgeIndex !== -1) {
    const newEdges = set(indexLens, edge, oldEdges);
    return set(edgesPath, newEdges, data);
  }

  return null;
};

/**
 * Modified version of cursorForObjectInConnection which uses primary ID as well
 *
 * @param connection
 * @param obj
 * @returns {*}
 */
export const cursorForObjectInConnection = (
  connection: Array<Object>,
  obj: Object,
) => {
  const cursor = cursorForObjectInConnectionOrig(connection, obj);

  // try to find by ID if the original fails
  if (!cursor && obj.id) {
    const objInConnectionById = find(propEq('id', obj.id))(connection);
    if (objInConnectionById) {
      return offsetToCursor(connection.indexOf(objInConnectionById));
    }
  }

  return cursor;
};
