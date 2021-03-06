const request = require('supertest');
const rodar = require('../index');

const port = 3035;
const rodarServerUrl = `http://localhost:${port}`;

describe('API', () => {
  before(() => {
    rodar.listen(port);
  });

  describe('GET definitions', () => {
    it('responds with the list of definitions', async () => {
      const definitions = {
        hello: a => a,
        login: () => {},
      };

      const expectedDefinitions = [
        {
          name: 'hello',
          parameters: {
            a: {
              name: 'a',
              type: 'any',
            },
          },
        },
        {
          name: 'login',
          parameters: {},
        },
      ];

      rodar.setDefinitions(definitions);

      await request(rodarServerUrl)
      .get('/api/definitions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expectedDefinitions);
    });
  });

  describe('POST state', () => {
    it('executes the definition handler with the state', async () => {
      const func = (arg1, arg2) => `${arg1}${arg2}`;

      const state = {
        name: 'func',
        state: { arg1: 'infi', arg2: 'nity' },
      };

      rodar.setDefinitions({ func });

      await request(rodarServerUrl)
      .post('/api/state')
      .send(state)
      .expect(200, { message: 'success', data: 'infinity' });
    });

    it('returns error on failure', async () => {
      const errorMessage = 'big bang error';
      const error = () => {
        throw new Error(errorMessage);
      };

      const state = {
        name: 'error',
        state: {},
      };

      rodar.setDefinitions({ error });

      await request(rodarServerUrl)
      .post('/api/state')
      .send(state)
      .expect(500, { message: 'error', error: errorMessage });
    });

    it('returns raw error if message is not defined', async () => {
      const errorMessage = 'big bang error';
      const error = () => {
        throw errorMessage;
      };

      const state = {
        name: 'error',
        state: {},
      };

      rodar.setDefinitions({ error });

      await request(rodarServerUrl)
      .post('/api/state')
      .send(state)
      .expect(500, { message: 'error', error: errorMessage });
    });

    it('handles circular dependencies', async () => {
      const func = () => {
        const foo = {
          bar: 'bar',
        };
        foo.foo = foo;
        return foo;
      };

      const state = {
        name: 'func',
        state: {},
      };

      rodar.setDefinitions({ func });

      await request(rodarServerUrl)
      .post('/api/state')
      .send(state)
      .expect(200, { message: 'success', data: { bar: 'bar', foo: '~' } });
    });
  });
});
