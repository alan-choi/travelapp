import React from 'react';
import Flex from './flex';

import './build_prompt.sass';
import {QUESTIONS} from '../common/constants';


let BuildPrompt = React.createClass({
  displayName: "BuildPrompt",

  getInitialState(){
    return ({
      value: "",
      promptIdx: 0,
    });
  },

  _handleBack(e){
    e.preventDefault();
    let curIdx = this.state.promptIdx;
    let nextIdx = curIdx > 0 ? (curIdx - 1) : curIdx;
    this.setState({ promptIdx: nextIdx });
  },

  _handleNext(e){
    e.preventDefault();
    let curIdx = this.state.promptIdx;
    let nextIdx = curIdx < (QUESTIONS.length-1) ? (curIdx + 1) : curIdx;
    this.props.submitInput({questionIdx: this.state.promptIdx, text: this.state.value});
    this.setState({ promptIdx: nextIdx });
  },

  _handleChange(e) {
    e.preventDefault();
    this.setState({value: e.target.value});
  },

  render(){
    return(
      <Flex className='BuildPrompt' direction='column' alignItems='center'>
        <h3></h3>
        <h4>{ QUESTIONS[this.state.promptIdx] }</h4>
        <input onChange={this._handleChange}></input>
        <Flex>
          <button onClick={this._handleBack}>{("back").toUpperCase()}</button>
          <button onClick={this._handleNext }>{("next").toUpperCase()}</button>
        </Flex>
      </Flex>
    );
  }
});

export default BuildPrompt;
