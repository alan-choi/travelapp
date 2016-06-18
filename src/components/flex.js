import React from 'react';
let Flex = React.createClass({
  render(){
      let style = {
        display: 'flex',
        flexDirection: this.props.direction || 'row',
        alignContent: this.props.alignContent || 'flex',
        alignItems: this.props.alignContent || 'center',
        justifyContent: this.props.justifyContent || 'flex-start'
      };
    return(
      <div className={this.props.className} style={style}>
        {this.props.children}
      </div>
    );
  }
});

export default Flex;
