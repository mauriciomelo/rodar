const request = require('supertest');
const double = require('../index');

const doubleServerUrl = 'localhost:3000';

describe('API', () => {
  before(() => {
    double.listen(3000);
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
      .get('/double/api/definitions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expectedDefinitions);
    });
  });

  describe('POST state', () => {
    it.only('changes the state for a definition', async () => {
      const definitions = [
        {
          name: 'hello',
          path: '/hello',
          method: 'get',
          handler: (req, res, { message }) => res.json({ message }),
        },
      ];

      const state = {
        name: 'hello',
        state: { message: 'by the API' },
      };

      double.setDefinitions(definitions);

      await request(doubleServerUrl)
      .post('/double/api/state')
      .send(state)
      .expect(200, { message: 'success' });

      await request(doubleServerUrl)
      .get('/hello')
      .expect(200, { message: 'by the API' });
    });
  });
});
