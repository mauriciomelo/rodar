const { Router } = require('express');
const _ = require('lodash');

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

const mock = (name, options, withRequestParams = {}) => {
  const definition = getDefinitions().find(d => d.name === name);
  removeFromStack(definition.path);
  routes[definition.method](definition.path, (req, res) => {
    const isMatch = Object.keys(withRequestParams).every(param =>
      _.isEqual(req.body, withRequestParams[param]));

    if (!isMatch) return;
    definition.handler(req, res, options);
  });
};

module.exports = {
  mock,
  routes,
  setDefinitions,
  getDefinitions,
};
