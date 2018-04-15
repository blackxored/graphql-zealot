import {
  addEdgeAndCursorToMutationResult,
  addEdgeToMutationResult,
  optimisticResponse,
} from '../mutations';

describe('addEdgeToMutationResult', () => {
  it('adds the object as the edge field on a payload', () => {
    const obj = { id: '1' };
    expect(addEdgeToMutationResult(obj)).toEqual({
      edge: {
        node: obj,
      },
    });
  });
});

describe('addEdgeAndCursorToMutationResult', () => {
  it('adds cursor and object as the edge field on a payload', async () => {
    const obj = 2;
    const connectionGetter = () => Promise.resolve([1, 2, 3, 4]);
    const result = await addEdgeAndCursorToMutationResult(connectionGetter)(2);

    expect(result).toHaveProperty('edge');
    expect(result.edge.cursor).toBeTruthy();
    expect(result.edge.node).toEqual(obj);
  });
});

describe('optimisticResponse', () => {
  it('adds an optimistic response shape to the given object', () => {
    const variables = {};
    const payload = {
      name: 'Foo',
    };

    expect(
      optimisticResponse('createUser', 'CreateUserPayload', payload, variables),
    ).toMatchSnapshot();
  });

  it('can accept a function to generate the response which is passed variables', () => {
    const variables = { id: 1 };
    const response = jest.fn(vars => ({
      ...vars,
      name: 'Foo',
    }));

    const result = optimisticResponse(
      'createUser',
      'CreateUserPayload',
      response,
      variables,
    );
    expect(result).toMatchSnapshot();
    expect(response).toHaveBeenCalledWith(variables);
  });
});
