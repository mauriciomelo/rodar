const { Router } = require('express');

const routes = Router();

let definitionStack;

const setDefinitions = (def) => {
  definitionStack = def;
};

const getDefinitions = () => definitionStack;

const removeFromStack = (path) => {
  const stack = routes.stack;
  const newStack = stack.filter(layer => layer.route.path !== path);
  routes.stack = newStack;
};

const mock = (name, options) => {
  const definition = getDefinitions().find(d => d.name === name);
  removeFromStack(definition.path);
  routes[definition.method](definition.path, (req, res) => {
    definition.handler(req, res, options);
  });
};

module.exports = {
  mock,
  routes,
  setDefinitions,
  getDefinitions,
};
