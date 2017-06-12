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

class DoubleClient {
  constructor(name) {
    this.name = name;
    this.requestParams = {};
  }

  withRequestParams(params) {
    this.requestParams = params;
    return this;
  }

  state(state) {
    const definition = getDefinitions().find(d => d.name === this.name);
    removeFromStack(definition.path);
    routes[definition.method](definition.path, (req, res) => {
      const isMatch = Object.keys(this.requestParams).every(param =>
        _.isEqual(req.body, this.requestParams[param]));

      if (!isMatch) return;
      definition.handler(req, res, state);
    });
  }
}

function Double(name) {
  return new DoubleClient(name);
}

Double.routes = routes;
Double.setDefinitions = setDefinitions;
Double.getDefinitions = getDefinitions;

module.exports = Double;
