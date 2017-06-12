const request = require('supertest');
const double = require('../index');
const definitions = require('./definitions');

const doubleServerUrl = 'localhost:3000';

describe('examples', () => {
  before(() => {
    double.setDefinitions(definitions);
    double.listen(3000);
  });

  describe('simple endpoint mocking', () => {
    it('responds with static json', async () => {
      double('hello').state();

      await request(doubleServerUrl)
      .get('/hello')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'It works' });
    });

    it('accepts multiple states', async () => {
      double('login').state({ logged: true });

      await request(doubleServerUrl)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'OK' });

      double('login').state({ logged: false });

      await request('localhost:3000')
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, { message: 'UNAUTHORIZED' });
    });
  });
});
