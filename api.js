const { Router } = require('express');
const definitions = require('./lib/definitions');

const routes = Router();

routes.get('/definitions', (req, res) => {
  res.json(definitions.getDefinitions());
});

routes.post('/state', (req, res) => {
  const name = req.body.name;
  const args = req.body.state;

  new Promise((response, reject) => {
    try {
      response(definitions.execute(name, args));
    } catch (e) {
      reject(e.message);
    }
  })
  .then(data => res.json({ message: 'success', data }))
  .catch(error => res.status(500).json({ message: 'error', error }));
});

module.exports = routes;
