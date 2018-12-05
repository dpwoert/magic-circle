import React, { Component } from 'react';
// import { addListener, removeListener } from '../../layers/dist/bundle';

const addListener = () => {}
const removeListener = () => {}

const withControls = WrappedComponent =>
  class ControlsProvider extends Component {

    constructor(props, context){
      super(props, context);
      this.state = { controls: [] };
      this.updateControls = this.updateControls.bind(this);
    }

    componentDidMount() {
      addListener(this.updateControls);
    }

    componentWillUnmount() {
      removeListener(this.updateControls);
    }

    updateControls(layers, activeLayer) {
      const hasControls = activeLayer && activeLayer.controls;
      const controls = hasControls ? activeLayer.controls : [];
      const path = hasControls ? activeLayer.path : '';
      this.setState({ controls, path });
    }

    render() {
      const {controls, path} = this.state;
      return <WrappedComponent controls={controls} path={path} {...this.props} />;
    }
  };

export default withControls;
