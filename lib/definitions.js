const { parse } = require('parse-function')();

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
  if (Array.isArray(def)) {
    definitionStack = def.map((d) => {
      if (typeof d === 'function') {
        return parseFunction(d);
      }
      return d;
    });
  } else {
    definitionStack = Object.keys(def).map(key => parseFunction(def[key]));
  }
};

const getDefinitions = () => definitionStack;

const getDefinitionByName = name => getDefinitions().find(d => d.name === name);


const execute = (name, params) => {
  const definition = getDefinitionByName(name);
  const args = Object.keys(definition.parameters).map(key => params[key]);
  return definition.handler.apply(null, args);
};

module.exports = {
  setDefinitions,
  getDefinitions,
  getDefinitionByName,
  execute,
};
