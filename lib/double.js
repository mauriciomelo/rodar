const express = require('express');

let definitionsStack;
const routes = express.Router('/');

const removeFromStack = (path) => {
  const stack = routes.stack;
  const newStack = stack.filter(layer => layer.route.path !== path);
  routes.stack = newStack;
};

const mock = (name, options) => {
  const definition = definitionsStack.find(d => d.name === name);
  removeFromStack(definition.path);
  routes[definition.method](definition.path, (req, res) => {
    definition.handler(req, res, options);
  });
};

const definitions = (def) => {
  definitionsStack = def;
};

const listen = (port, cb) => {
  const server = express();
  server.use(routes);
  server.listen(port, cb);
};

module.exports = {
  routes,
  definitions,
  mock,
  listen,
};
