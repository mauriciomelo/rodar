import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import axios from 'axios';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import './styles.css';

const getApiUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get('api') || 'api';
  return url;
};

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

class Doubles extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.contentFor = this.contentFor.bind(this);
    this.fetchDefinitions();
    this.state = {
      definitions: [],
      editorContents: {},
    };
  }

  async handleChange(name, content) {
    const editorContents = { ...this.state.editorContents, ...{ [name]: content } };
    this.setState({ editorContents });
  }

  async handleRun(definition) {
    const state = {
      name: definition.name,
      state: definition.state,
    };
    const response = await axios.post(`${getApiUrl()}/state`, state);
    this.setState({ response: response.data.data })
  }

  contentFor(definition) {
    return this.state.editorContents[definition.name];
  }

  async fetchDefinitions() {
    const { data } = await axios.get(`${getApiUrl()}/definitions`);
    this.setState({ definitions: data });
  }

  render() {
    return (
      <div className="container">
        { this.state.definitions.map(definition => (
          <Definition
            key={definition.name}
            definition={definition}
            onChange={this.handleChange}
            onRun={this.handleRun}
            response={this.state.response}
            editorContent={this.contentFor(definition)}
          />
        ))}
      </div>
    );
  }
}

export default Doubles;
