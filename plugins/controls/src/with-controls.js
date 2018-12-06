import React, { Component } from 'react';

const withControls = (WrappedComponent, store) =>
  class ControlsProvider extends Component {

    constructor(props, context){
      super(props, context);
      this.state = { controls: [] };
      this.update = this.update.bind(this);
    }

    componentDidMount() {
      console.log('add listener')
      store.addListener(this.update);
    }

    componentWillUnmount() {
      store.removeListener(this.update);
    }

    update({layers, activeLayer}) {
      console.log('UPDATE', layers, activeLayer)
      const hasControls = activeLayer && activeLayer.controls;
      const controls = hasControls ? activeLayer.controls : [];
      const path = hasControls ? activeLayer.path : '';
      this.setState({ controls, path });
    }

    render() {
      const {controls, path} = this.state;
      console.log('state', this.state)
      return <WrappedComponent controls={controls} path={path} {...this.props} />;
    }
  };

export default withControls;
