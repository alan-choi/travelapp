import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute ,browserHistory } from 'react-router';

import NavBar from './components/navbar';
import Flex from './components/flex';

import BuildPrompt from './components/build_prompt';
import TripTile from './components/trip_tile';
import {QUESTIONS, TILES} from './common/constants';
import './common/main.sass';

let App = React.createClass({
  getDefaultProps: () => {
    return {
      tiles: {
        destination: {city: "", lat: null, lng: null},
        when: {},
        travelers: {},
        budget: {},
        itinerary: {}
      }
    };
  },
  getInitialState(){
    return ({
      trip: {
        destination: {city: "", lat: null, lng: null},
        when: {date: {day: "", month: "", year: ""}},
        travelers: {name: "", email: ""},
        flights: {departing: {}, returning: {}},
        budget: {},
        itinerary: {}
      }
    });
  },

  _submitInput(data){
    //change questions to be in the object.
    console.log(data);
  },

  render() {
    let tripTiles = Object.keys(this.state.trip).map((title, idx) => <TripTile key={title+idx} title={title} />);
    return (
      <div className="App" direction='column'>
        <NavBar />
        <Flex justifyContent='space-around'>
          { tripTiles }
        </Flex>
        <Flex className="app-content" direction='column' alignContent='center' justifyContent='center'>
          <BuildPrompt submitInput={this._submitInput} />
        </Flex>
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
