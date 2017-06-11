const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const double = require('./lib/double');
const apiRoutes = require('./api');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use('/double', express.static(path.join(__dirname, 'service-double-ui/build')));
server.use('/double/api', apiRoutes);
server.use(double.routes);

const listen = (port, cb) => {
  server.listen(port, cb);
};

module.exports = {
  mock: double.mock,
  setDefinitions: double.setDefinitions,
  listen,
};
