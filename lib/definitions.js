let definitionStack;

const setDefinitions = (def) => {
  definitionStack = def;
};

const getDefinitions = () => definitionStack;

const getDefinitionByName = name => getDefinitions().find(d => d.name === name);

module.exports = {
  setDefinitions,
  getDefinitions,
  getDefinitionByName,
};
