const { Router } = require('express');
const definitions = require('./lib/definitions');

const routes = Router();

routes.get('/definitions', (req, res) => {
  res.json(definitions.getDefinitions());
});

routes.post('/state', (req, res) => {
  const handlerName = req.body.name;
  const definition = definitions.getDefinitionByName(handlerName);

  new Promise((response, reject) => {
    const args = Object.keys(definition.parameters).map(key => req.body.state[key]);
    try {
      response(definition.handler.apply(null, args));
    } catch (e) {
      reject(e.message);
    }
  })
  .then(data => res.json({ message: 'success', data }))
  .catch(error => res.status(500).json({ message: 'error', error }));
});

module.exports = routes;
