const express = require('express');
const bodyParser = require('body-parser');
const double = require('./lib/double');
const apiRoutes = require('./api');

const server = express();
server.use(bodyParser.json());
server.use('/double', apiRoutes);
server.use(double.routes);

const listen = (port, cb) => {
  server.listen(port, cb);
};

module.exports = {
  mock: double.mock,
  setDefinitions: double.setDefinitions,
  listen,
};
