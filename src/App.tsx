import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css"
import Home from './editor/Home';
import MirfEditor from './mirf-editor/components/MirfEditor';
import Navbar from "./common/Navbar"

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/mirf-editor">
              <div>
                <MirfEditor/>
              </div>
            </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
