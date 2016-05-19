import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute ,browserHistory } from 'react-router';

let App = React.createClass({

  render() {
    return (
      <div>
        <p>Hello World</p>
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
