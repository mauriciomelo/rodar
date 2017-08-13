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

const apiUrl = 'http://localhost:3030/double/api';

const Definition = (props) => {
  let editorText;

  const options = {
    mode: { name: 'javascript', json: true },
    tabSize: 2,
    smartIndent: true,
    theme: 'material',
    autoCloseBrackets: true,
  };

  const handleChange = (text) => {
    editorText = text;
  };

  const {
    name,
    method,
    path,
  } = props.definition;

  const run = () => {
    const state = JSON.parse(editorText);
    props.onChange({ name, state });
  };

  const Title = () => (
    <div className="definitionTitle">
      <span className={`method ${method}`}>{method} </span>
      <span className="name">{name} </span>
      <span className="path">{path}</span>
    </div>
  );

  return (
    <Card className="definition">
      <CardHeader
        title={<Title />}
        actAsExpander
        showExpandableButton
      />
      <CardText style={{ padding: '0' }} expandable>
        <div className="cardContent">
          <h3>state:</h3>
          <CodeMirror
            onChange={handleChange}
            options={options}
          />
        </div>
        <CardActions>
          <FlatButton primary label="run" onClick={run} />
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
};

class Doubles extends Component {
  static handleChange(definition) {
    const state = {
      name: definition.name,
      state: definition.state,
    };
    axios.post(`${apiUrl}/state`, state);
  }

  constructor() {
    super();
    this.fetchDefinitions();
    this.state = {
      definitions: [],
    };
  }

  async fetchDefinitions() {
    const { data } = await axios.get(`${apiUrl}/definitions`);
    this.setState({ definitions: data });
  }

  render() {
    return (
      <div className="container">
        { this.state.definitions.map(definition => (
          <Definition
            key={definition.name}
            definition={definition}
            onChange={Doubles.handleChange}
          />
        ))}
      </div>
    );
  }
}

export default Doubles;
