const { Router } = require('express');
const double = require('./lib/double');

const routes = Router();

routes.get('/definitions', (req, res) => {
  res.json(double.getDefinitions());
});

routes.post('/state', (req, res) => {
  double(req.body.name).state(req.body.state);
  res.json({ message: 'success' });
});

module.exports = routes;
