import Flex from './flex';
import React from 'react';

import './navbar.sass';
let NavBar = React.createClass({
  displayName: "NavBar",
  render(){
    let navItems = ['home', 'explore', 'sign in' ].map((text, idx) =>
      React.createElement('p', {key: idx+text, className: "nav-item"}, text.toUpperCase()));
    return(
        <Flex className='NavBar' direction='row' alignContent='center' justifyContent='flex-end'>
          {navItems}
        </Flex>
    );
  }
});

export default NavBar;
