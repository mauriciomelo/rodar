/* eslint react/no-unused-prop-types: 0 */
/* eslint react/forbid-prop-types: 0 */
/* eslint react/require-default-props: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';

const Definition = (props) => {
  const options = {
    mode: { name: 'javascript', json: true },
    tabSize: 2,
    smartIndent: true,
    theme: 'material',
    autoCloseBrackets: true,
  };

  const {
    name,
    parameters,
  } = props.definition;

  const handleChange = (text) => {
    props.onChange(name, text);
  };

  const handleRun = () => {
    const state = JSON.parse(props.editorContent);
    props.onRun({ name, state });
  };

  const Title = () => (
    <div className="definitionTitle">
      <span className="name">{name} </span>
    </div>
  );

  const params = () => {
    const paramsList = Object.keys(parameters)
    .map(key => ({ [parameters[key].name]: parameters[key].type }));
    const paramsObject = paramsList.reduce((obj, param) => Object.assign(obj, param));
    return JSON.stringify(paramsObject, null, 2);
  };

  const sanitizedResponse = () => JSON.stringify(props.response, null, 2);

  return (
    <Card className="definition">
      <CardHeader
        title={<Title />}
        actAsExpander
        showExpandableButton
      />
      <CardText style={{ padding: '0' }} expandable>
        <div className="cardContent">
          <h3>parameters:</h3>
          <pre>{ params() }</pre>
          <h3>state:</h3>
          <CodeMirror
            onChange={handleChange}
            options={options}
          />
          <pre>
            { sanitizedResponse() }
          </pre>
        </div>
        <CardActions>
          <FlatButton primary label="run" onClick={handleRun} />
        </CardActions>
      </CardText>
    </Card>
  );
};

Definition.propTypes = {
  definition: PropTypes.shape({
    name: PropTypes.string,
    method: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
  response: PropTypes.any,
};

export default Definition;
