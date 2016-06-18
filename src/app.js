import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute ,browserHistory } from 'react-router';

import NavBar from './components/navbar';
import Flex from './components/flex';

import './assets/main.sass';

let App = React.createClass({

  render() {
    return (
      <div className="App" direction='column'>
        <NavBar />
        <p>Furture site to come..</p>
      </div>);
  }
});
const routes = (
  <Router history={ browserHistory }>
    <Route path='/' component={ App }></Route>
  </Router>
);

let mount = window.document.getElementById('app');
render(routes, mount);
