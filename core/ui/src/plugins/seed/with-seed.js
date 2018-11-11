import React, { Component } from 'react';

let seed = 0;
let listeners = [];

export const getSeed = (print) => {
  return print ? String(seed).replace('0.') : seed;
};

export const updateSeed = newSeed => {
  seed = newSeed;
  listeners.forEach(l => l(seed));
};

export const addListener = fn => {
  listeners.push(fn);
};

export const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

const withSeed = WrappedComponent =>
  class SeedProvider extends Component {

    constructor(props, context){
      super(props, context);
      this.state = { seed };
      this.updateSeed = this.updateSeed.bind(this);
    }

    componentDidMount() {
      addListener(this.updateSeed);
    }

    componentWillUnmount() {
      removeListener(this.updateSeed);
    }

    updateSeed(seed) {
      this.setState({ seed });
    }

    render() {
      const { seed } = this.state;
      return <WrappedComponent seed={seed} {...this.props} />;
    }
  };

export default withSeed;
