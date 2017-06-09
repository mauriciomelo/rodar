const request = require('supertest');
const double = require('../index');
const definitions = require('./definitions');

const doubleServerUrl = 'localhost:3000';

describe('examples', () => {
  before(() => {
    double.definitions(definitions);
    double.listen(3000);
  });

  describe('simple endpoint mocking', () => {
    it('responds with static json', async () => {
      double.mock('hello');

      await request(doubleServerUrl)
      .get('/hello')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'It works' });
    });

    it('accepts multiple states', async () => {
      double.mock('login', { logged: true });

      await request(doubleServerUrl)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'OK' });

      double.mock('login', { logged: false });

      await request('localhost:3000')
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, { message: 'UNAUTHORIZED' });
    });
  });
});
