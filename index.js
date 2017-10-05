const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const definitions = require('./lib/definitions');
const apiRoutes = require('./api');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use('/', express.static(path.join(__dirname, 'rodar-ui/build')));
server.use('/api', apiRoutes);

const listen = (port, cb) => {
  server.listen(port, cb);
};

definitions.listen = listen;

module.exports = definitions;
