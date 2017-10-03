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

  describe('#setDefinitions', () => {
    it('accepts an array of objects', () => {
      const foo = { name: 'foo' };
      const bar = { name: 'bar' };
      definitions.setDefinitions([foo, bar]);
      expect(definitions.getDefinitions()).to.deep.equal([foo, bar]);
    });

    it('accepts an array of plain functions', () => {
      const foo = () => {};
      const bar = () => {};

      definitions.setDefinitions([foo, bar]);
      expect(definitions.getDefinitions()[0]).to.contain({ name: 'foo', handler: foo });
      expect(definitions.getDefinitions()[1]).to.contain({ name: 'bar', handler: bar });
    });

    it('accepts an object of plain functions', () => {
      const obj = {
        foo: () => {},
        bar: () => {},
      };

      definitions.setDefinitions(obj);
      expect(definitions.getDefinitions()[0]).to
      .contain({ name: 'foo', handler: obj.foo });
      expect(definitions.getDefinitions()[1]).to
      .contain({ name: 'bar', handler: obj.bar });
    });

    it('accepts plain functions with metadata to override function definition', () => {
      const foo = () => {};
      const metadata = { name: 'bar' };
      foo.metadata = metadata;

      definitions.setDefinitions([foo]);
      expect(definitions.getDefinitions()[0]).to.have
      .property('name', 'bar');
    });
  });
});
