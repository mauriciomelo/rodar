const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const double = require('../index');

const port = 3035;
const doubleServerUrl = `http://localhost:${port}`;

describe('API', () => {
  before(() => {
    double.listen(port);
  });

  describe('GET definitions', () => {
    it('responds with the list of definitions', async () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
          handler: () => {},
        },
        {
          name: 'login',
          path: '/login',
          method: 'post',
          handler: () => {},
        },
      ];
      const expectedDefinitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
        },
        {
          name: 'login',
          path: '/login',
          method: 'post',
        },
      ];

      double.setDefinitions(definitions);

      await request(doubleServerUrl)
      .get('/api/definitions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expectedDefinitions);
    });
  });

  describe('POST state', () => {
    it('executes the definition handler with the state', async () => {
      const handler = sinon.spy();
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
          handler,
        },
      ];

      const state = {
        name: 'hello',
        state: { message: 'by the API' },
      };

      double.setDefinitions(definitions);

      await request(doubleServerUrl)
      .post('/api/state')
      .send(state)
      .expect(200, { message: 'success' });

      expect(handler.calledWith(state.state)).to.equal(true);
    });
  });
});
