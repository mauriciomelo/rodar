const { Router } = require('express');
const definitions = require('./lib/definitions');
const circularJson = require('circular-json');

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
      reject(e.message || e);
    }
  })
  .then((data) => {
    const sanitizedData = JSON.parse(circularJson.stringify(data));
    res.json({ message: 'success', data: sanitizedData });
  })
  .catch(error => res.status(500).json({ message: 'error', error }));
});

module.exports = routes;
