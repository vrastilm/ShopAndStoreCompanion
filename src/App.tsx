import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './modules/global/Theme';
import RouterSwitch from './modules/router/ReactRouterSwitch';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './modules/global/Layout';
import { hot } from 'react-hot-loader';
import LoaderProvider from './contexts/LoaderContext';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <LoaderProvider>
            <Layout>
              <RouterSwitch />
            </Layout>
          </LoaderProvider>
        </Router>
      </ThemeProvider>
    </div>
  );
}

declare const module: any;
export default hot(module)(App);
