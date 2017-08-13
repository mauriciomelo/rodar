/* eslint no-unused-expressions: 0 */
const { expect } = require('chai');
const definitions = require('./definitions');

describe('definitions', () => {
  describe('#getDefinitionByName', () => {
    it('returns a definition given a name', () => {
      const foo = { name: 'foo' };
      const bar = { name: 'bar' };
      definitions.setDefinitions([foo, bar]);
      expect(definitions.getDefinitionByName('foo')).to.equal(foo);
    });
  });
});
