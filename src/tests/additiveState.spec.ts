import { assert } from 'chai';
import AdditiveState from '../modules/additives/AdditivesState';

describe('AdditiveState tests', () => {
  it('Should load AdditiveState correctly', () => {
    const state = new AdditiveState();

    assert.equal(state.additivesArrShown.length, 0);

    state.load();

    assert.equal(state.nShown, 10);
    assert.equal(state.filter, '');
    assert.equal(state.additivesArrShown.length, 10);
  });
});
