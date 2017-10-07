const { parse } = require('parse-function')();
const _ = require('lodash');

let definitionStack;

const parseFunction = (fn) => {
  const def = {};
  def.name = fn.name;
  def.handler = fn;
  const defaultParams = parse(fn).defaults;
  def.parameters = Object.keys(defaultParams)
  .reduce((accumulator, key) => {
    const param = {};
    param.name = key;
    param.type = 'any';
    if (defaultParams[key]) { param.default = defaultParams[key]; }
    return Object.assign({}, accumulator, { [key]: param });
  }, {});

  return Object.assign({}, def, fn.metadata);
};

const setDefinitions = (def) => {
  definitionStack = def;
};

const getDefinitions = () => {
  let keys;
  if (_.isPlainObject(definitionStack)) {
    keys = Object.keys(definitionStack);
  } else {
    keys = Object.getOwnPropertyNames(Object.getPrototypeOf(definitionStack))
    .filter(name => name !== 'constructor');
  }

  return keys.map(key => parseFunction(definitionStack[key]));
};

const getDefinitionByName = name => getDefinitions().find(d => d.name === name);


const execute = (name, params) => {
  const definition = getDefinitionByName(name);
  const args = Object.keys(definition.parameters).map(key => params[key]);
  return definitionStack[name](...args);
};

module.exports = {
  setDefinitions,
  getDefinitions,
  getDefinitionByName,
  execute,
};
