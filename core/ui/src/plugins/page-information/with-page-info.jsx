import React, { Component } from 'react';

let info = {};
let listeners = [];

export const getInfo = () => {
  return info;
};

export const updateInfo = newInfo => {
  info = newInfo;
  listeners.forEach(l => l(info));
};

export const addListener = fn => {
  listeners.push(fn);
};

export const removeListener = fn => {
  const id = listeners.getIndex(fn);
  listeners.splice(i, 1);
};

const withPageInfo = WrappedComponent =>
  class PageInfoProvider extends Component {

    constructor(props, context){
      super(props, context);
      this.state = { info };
      this.updateInfo = this.updateInfo.bind(this);
    }

    componentDidMount() {
      addListener(this.updateInfo);
    }

    componentWillUnmount() {
      removeListener(this.updateInfo);
    }

    updateInfo(info) {
      this.setState({ info });
    }

    render() {
      const { info } = this.state;
      return <WrappedComponent info={info} {...this.props} />;
    }
  };

export default withPageInfo;
