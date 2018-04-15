import graphqlUtils, {
  addEdgeToMutationResult,
  getTypenameForFile,
} from '../index';

describe('graphql-zealot', () => {
  test('ensures that we can import named, as default, and with module aliases', () => {
    [addEdgeToMutationResult, getTypenameForFile].forEach(fn => {
      expect(fn).toBeDefined();
    });

    expect(graphqlUtils.addEdgeToMutationResult).toBe(addEdgeToMutationResult);
  });
});
