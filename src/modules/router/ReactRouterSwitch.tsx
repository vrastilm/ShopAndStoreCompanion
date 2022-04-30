import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Additives from '../additives/Additives';
import Home from '../home/Home';

function RouterSwitch() {
  return (
    <Switch>
      <Route path="/additives">
        <Additives />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default RouterSwitch;
