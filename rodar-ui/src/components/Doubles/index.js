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
    this.responseFor = this.responseFor.bind(this);
    this.contentFor = this.contentFor.bind(this);
    this.fetchDefinitions();
    this.state = {
      definitions: [],
      editorContents: {},
      responses: {},
      definitionsState: {},
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
    const response = {};
    this.setDefinitionState(definition.name, { isLoading: true });
    try {
      const { data } = await axios.post(`${getApiUrl()}/state`, state);
      response.success = data.data;
    } catch (e) {
      response.error = e.response.data.error;
    }
    this.setDefinitionState(definition.name, { isLoading: false });

    const responses = { ...this.state.responses, ...{ [definition.name]: response } };
    this.setState({ responses });
  }

  setDefinitionState(name, state) {
    const oldState = this.state.definitionsState[name];
    const newState = { ...oldState, ...state };
    this.setState({ definitionsState: { ...this.definitionsState, ...{ [name]: newState } } });
  }

  contentFor(definition) {
    return this.state.editorContents[definition.name];
  }

  responseFor(definition) {
    return this.state.responses[definition.name];
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
            response={this.responseFor(definition)}
            editorContent={this.contentFor(definition)}
            {...this.state.definitionsState[definition.name]}
          />
        ))}
      </div>
    );
  }
}

export default Doubles;
