import React, { Component } from 'react';
import axios from 'axios';
import Definition from './Definition';
import './styles.css';

const getApiUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get('api') || 'api';
  return url;
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
    this.setState({ response: response.data.data });
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
