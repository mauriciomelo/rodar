let definitionStack;

const parseFunction = (fn) => {
  const def = {};
  def.name = fn.name;
  def.handler = fn;
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

module.exports = {
  setDefinitions,
  getDefinitions,
  getDefinitionByName,
};
