import { formValues } from '../forms';

describe('formValues', () => {
  it('strips __typename and id from an object', () => {
    const obj = { id: '1', __typename: 'Some', name: 'Foo' };
    expect(formValues(obj)).toEqual({ name: 'Foo' });
  });
});
