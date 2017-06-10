const { Router } = require('express');
const double = require('./lib/double');

const routes = Router();

routes.get('/definitions', (req, res) => {
  res.json(double.getDefinitions());
});

routes.post('/state', (req, res) => {
  double.mock(req.body.name, req.body.state);
  res.json({ message: 'success' });
});

module.exports = routes;
