import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Doubles from '../Doubles';
import './styles.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <div>
      <h1 className="appTitle">Rodar</h1>
      <Doubles />
    </div>
  </MuiThemeProvider>
);


export default App;
