import { flattenEdges, mapEdgesToProp } from '../props';

describe('flattenEdges', () => {
  it('returns an Array from a GraphQL connection', () => {
    const result = flattenEdges({
      edges: [
        {
          node: { id: '1' },
        },
        {
          node: { id: '2' },
        },
      ],
    });

    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('returns an empty array if no edges are passed', () => {
    expect(flattenEdges({})).toEqual([]);
  });

  it('returns an empty array if undefined is passed', () => {
    expect(flattenEdges()).toEqual([]);
  });
});

describe('mapEdgesToProp', () => {
  it('add edges as a prop', () => {
    const data = {
      viewer: {
        babies: {
          edges: [{ node: { id: '1' } }],
        },
      },
    };

    const result = mapEdgesToProp('viewer.babies', 'babies', data);

    expect(result).toEqual({
      data,
      babies: [{ id: '1' }],
    });
  });
});
