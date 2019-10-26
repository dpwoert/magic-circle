import React, { Component } from 'react';

const withControls = (WrappedComponent, store) =>
  class ControlsProvider extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = { controls: [], children: [] };
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
          children: active.children,
          path: active.path,
        });
      } else {
        this.setState({
          controls: [],
          children: [],
          path: '',
        });
      }
    }

    render() {
      const { controls, path, children } = this.state;
      return (
        <WrappedComponent
          controls={controls}
          layers={children}
          path={path}
          {...this.props}
        />
      );
    }
  };

export default withControls;
