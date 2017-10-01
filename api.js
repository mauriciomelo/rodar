const { Router } = require('express');
const definitions = require('./lib/definitions');

const routes = Router();

routes.get('/definitions', (req, res) => {
  res.json(definitions.getDefinitions());
});

routes.post('/state', (req, res) => {
  const handlerName = req.body.name;
  const handler = definitions.getDefinitionByName(handlerName).handler;
  try {
    const data = handler(req.body.state);
    res.json({ message: 'success', data });
  } catch (err) {
    const error = err.message;
    res.status(500).json({ message: 'error', error });
  }
});

module.exports = routes;
