// @flow
import {
  curry,
  find,
  last,
  lensPath,
  path,
  pathEq,
  set,
  view,
  without,
} from 'ramda';
import { replaceEdge } from './connection';

/**
 * Direction to add to in a list.
 * Either "head" or "tail"
 */
type AddTo = 'head' | 'tail';

/**
 * Returns a function that will use Apollo's DataProxy to update
 * a Query by adding an edge to a list of edges.
 *
 * @param query GraphQL query constructed with `graphql-tag`
 * @param operationName Mutation name
 * @param edgePath An array to a path to the list of edges
 * @param addTo Whether to add the new edge to the beginning or end of the list
 * @returns {Function} A function that it's passed to Apollo's update function.
 *
 */
export const addEdge = (
  query: DocumentNode,
  operationName: string,
  edgePath: Array<string>,
  addTo: AddTo = 'tail',
) => (store: DataProxy, { data: payload }: Object) => {
  if (payload[operationName]) {
    const data = store.readQuery({ query });
    const edges = path(edgePath, data);

    const addWith = addTo === 'head' ? 'unshift' : 'push';

    edges[addWith](payload[operationName].edge);
    store.writeQuery({ query, data });
  }
};

/**
 * Returns a function that will use Apollo's DataProxy to update
 * a Fragment by adding an edge to a list of edges.
 *
 * @param fragment GraphQL fragment constructed with `graphql-tag`
 * @param operationName Mutation name
 * @param edgePath An array to a path to the list of edges
 * @param rootId The root ID for this fragment
 * @param addTo Whether to add the new edge to the beginning or end of the list
 * @returns {Function} A function that it's passed to Apollo's update function.
 *
 * @example
 * {
 *   // ...
 *   update: addEdgeToFragment(
 *      Favorites.fragments.favorites,
 *     'toggleFavorite',
 *     ['favorites'],
 *     userId,
 *     'head',
 *     {
 *       fragmentName: 'Favorites',
 *     }
 *   ),
 * }
 */
export const addEdgeToFragment = (
  fragment: DocumentNode,
  operationName: string,
  edgePath: Array<string>,
  rootId: string,
  addTo: string = 'tail',
  fragmentOptions?:
    | DataProxyReadFragmentOptions
    // $FlowFixMe$
    | DataProxyWriteFragmentOptions = {},
) => (store: DataProxy, { data: payload }: Object) => {
  if (!path([operationName, 'edge'], payload)) {
    return;
  }

  const id = rootId;
  // $FlowFixMe$
  const data = store.readFragment({ fragment, id, ...fragmentOptions });

  if (last(edgePath) !== 'edges') {
    edgePath.push('edges');
  }
  const edges = path(edgePath, data);

  if (!edges) {
    return;
  }

  const addWith = addTo === 'head' ? 'unshift' : 'push';
  edges[addWith](payload[operationName].edge);

  // $FlowFixMe$
  store.writeFragment({ fragment, ...fragmentOptions, id, data });
};

/**
 * Remove an edge from a list
 *
 * @param edgePath
 * @param edgeId
 * @param data
 * @param payload
 * @returns {*}
 */
export const removeEdge = (
  edgePath: Array<string>,
  edgeId: string,
  data: Object,
  payload: Object,
) => {
  if (last(edgePath) !== 'edges') {
    edgePath.push('edges');
  }

  // $FlowFixMe$
  const edgesPath = lensPath(edgePath);
  const edges = view(edgesPath, data);

  // By convention we use the first key to fetch the payload
  // maybe we can use this on addEdges... above
  const operationName = Object.keys(payload)[0];

  if (!payload[operationName]) {
    // The operation didn't complete successfully so we return early.
    return null;
  }

  const edge = find(pathEq(['node', 'id'], edgeId), edges);

  const newEdges = set(edgesPath, without([edge], edges), data);

  return newEdges;
};

/**
 * Remove edge from a list in Fragment
 *
 * @param fragment
 * @param edgeId
 * @param rootId
 * @param edgePath
 * @param fragmentOptions
 * @returns {Function}
 */
export const removeEdgeFromFragment = (
  fragment: DocumentNode,
  edgeId: string,
  rootId: string,
  edgePath: Array<string>,
  fragmentOptions?:
    | DataProxyReadFragmentOptions
    // $FlowFixMe$
    | DataProxyWriteFragmentOptions = {},
) => (store: DataProxy, { data: payload }: Object) => {
  // $FlowFixMe$
  const data = store.readFragment({ fragment, id: rootId, ...fragmentOptions });

  // $FlowFixMe$
  const newData = removeEdge(edgePath, edgeId, data, payload);

  if (newData) {
    // $FlowFixMe$
    store.writeFragment({
      fragment,
      ...fragmentOptions,
      id: rootId,
      data: newData,
    });
  }
};

const updateFragment = curry(
  (
    updaterFn: Function,
    fragment: DocumentNode,
    rootId: string,
    fragmentOptions?:
      | DataProxyReadFragmentOptions
      // $FlowFixMe$
      | DataProxyWriteFragmentOptions = {},
  ) => store => {
    const oldData = store.readFragment({
      fragment,
      id: rootId,
      ...fragmentOptions,
    });
    const newData = updaterFn(oldData);
    if (newData) {
      // $FlowFixMe$
      store.writeFragment({
        fragment,
        id: rootId,
        ...fragmentOptions,
        data: newData,
      });
    }
  },
);

/**
 * Replaces an edge in a Fragment
 *
 * @param edge
 * @param fragment
 * @param rootId
 * @param edgePath
 * @returns {*}
 */
export const replaceEdgeInFragment = (
  edge: Object,
  fragment: DocumentNode,
  rootId: string,
  edgePath: Array<string>,
) => {
  return updateFragment(fragmentData =>
    replaceEdge(fragmentData, edgePath, edge),
  );
};

// $FlowFixMe$
export const getCurrentUserFromStore = (gql, store) => {
  try {
    return store.readQuery({
      query: gql`
        query CurrentUser {
          viewer {
            user {
              id
              firstName
              lastName
              avatar {
                url
              }
            }
          }
        }
      `,
    });
  } catch (err) {
    return null;
  }
};
