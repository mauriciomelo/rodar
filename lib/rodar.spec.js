/* eslint no-unused-expressions: 0 */
const { expect } = require('chai');
const definitions = require('./definitions');

describe('definitions', () => {
  describe('#getDefinitionByName', () => {
    it('returns a definition given a name', () => {
      const foo = () => {};
      const bar = () => {};
      definitions.setDefinitions({ foo, bar });
      expect(definitions.getDefinitionByName('foo').name).to.equal('foo');
    });
  });

  describe('#getDefinitions', () => {
    it('does _not_ include the constructor method', () => {
      class Foo {
        constructor() {
          this.bar = 32;
        }

        hello() {
          return this.bar + 10;
        }
      }

      const foo = new Foo();
      definitions.setDefinitions(foo);
      expect(definitions.getDefinitions().length).to.equal(1);
    });
  });

  describe('#execute', () => {
    it('executes function by name', () => {
      definitions.setDefinitions({
        foo: msg => msg,
      });

      expect(definitions.execute('foo', { msg: 'bar' })).to.equal('bar');
    });

    it('preserves `this` context', () => {
      class Foo {
        constructor() {
          this.bar = 32;
        }

        hello() {
          return this.bar + 10;
        }
      }
      const foo = new Foo();
      definitions.setDefinitions(foo);

      expect(definitions.execute('hello', {})).to.equal(42);
    });
  });

  describe('#setDefinitions', () => {
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

    it('parse functions parameters', () => {
      const foo = (a = 42, b) => a + b;

      definitions.setDefinitions({ foo });
      expect(definitions.getDefinitions()).to.have
      .deep.nested.property('[0].parameters', {
        a: { name: 'a', type: 'any', default: '42' },
        b: { name: 'b', type: 'any' },
      });
    });
  });
});
