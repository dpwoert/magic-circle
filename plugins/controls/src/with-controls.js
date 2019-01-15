import React, { Component } from 'react';

const withControls = (WrappedComponent, store) =>
  class ControlsProvider extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = { controls: [] };
      this.update = this.update.bind(this);
    }

    componentDidMount() {
      store.addListener(this.update);
    }

    componentWillUnmount() {
      store.removeListener(this.update);
    }

    update({ mapping, activeLayer }) {
      const active = mapping.get(activeLayer);
      if (active && active.controls) {
        this.setState({
          controls: active.controls,
          path: active.path,
        });
      } else {
        this.setState({
          controls: [],
          path: '',
        });
      }
    }

    render() {
      const { controls, path } = this.state;
      return (
        <WrappedComponent controls={controls} path={path} {...this.props} />
      );
    }
  };

export default withControls;
