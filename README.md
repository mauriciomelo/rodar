# rodar

UI for your plain old functions

## Install

```
npm i rodar
```

## Usage

```
const rodar = require('rodar');

rodar.setDefinitions({ myFunction: message => message });
rodar.listen(3030);

console.log('listening at http://localhost:3030');
```
