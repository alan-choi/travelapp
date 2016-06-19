import React from 'react';

import Flex from './flex';

import './trip_tile.sass';

export default React.createClass({
  displayName: "TripTile",

  render(){
    return (
      <Flex className='TripTile' direction='column' alignItems='center' justifyContent='center'>
        <h5>{this.props.title.toUpperCase()}</h5>
      </Flex>
    );
  }
});
