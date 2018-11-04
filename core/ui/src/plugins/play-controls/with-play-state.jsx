import React, { Component } from 'react';

let play = false;
let listeners = [];

export const updatePlayState = playing => {
  play = playing;
  listeners.forEach(l => l(play));
};

export const addListener = fn => {
  listeners.push(fn);
};

export const removeListener = fn => {
  const id = listeners.indexOf(fn);
  listeners.splice(id, 1);
};

const withPlayState = WrappedComponent =>
  class PlayStateProvider extends Component {

    constructor(props, context){
      super(props, context);
      this.state = { play };
      this.updatePlayState = this.updatePlayState.bind(this);
    }

    componentDidMount() {
      addListener(this.updatePlayState);
    }

    componentWillUnmount() {
      removeListener(this.updatePlayState);
    }

    updatePlayState(play) {
      this.setState({ play });
    }

    render() {
      const { play } = this.state;
      return <WrappedComponent play={play} {...this.props} />;
    }
  };

export default withPlayState;
