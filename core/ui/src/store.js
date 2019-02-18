import React, { Component } from 'react';

const withStore = (WrappedComponent, store) =>
  class LayerProvider extends Component {
    static navigation = WrappedComponent.navigation;

    constructor(props, context) {
      super(props, context);
      this.state = { data: store.get() };
      this.update = this.update.bind(this);
    }

    componentDidMount() {
      store.addListener(this.update);
    }

    componentWillUnmount() {
      store.removeListener(this.update);
    }

    update(data) {
      this.setState({ data });
    }

    render() {
      const { data } = this.state;
      const props = !!data && data.constructor === Object ? data : { data };
      return (
        <WrappedComponent
          store={store}
          set={store.set}
          {...props}
          {...this.props}
        />
      );
    }
  };

class Store {
  constructor(initialData = {}) {
    this.listeners = [];
    this.debouncedListeners = [];
    this.data = initialData;

    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
  }

  get(key) {
    return key ? this.data[key] : this.data;
  }

  set(key, value) {
    if (value !== undefined) {
      this.data[key] = value;
    } else {
      this.data = key;
    }
    this.refresh();
  }

  refresh() {
    this.listeners.forEach(l => l(this.data));

    // debounce
    if (this.nextUpdate) clearTimeout(this.nextUpdate);
    this.nextUpdate = setTimeout(this.update);
  }

  update(fn) {
    if (fn) {
      this.debouncedListeners.push(fn);
    } else {
      this.debouncedListeners.forEach(l => l(this.data));
    }
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  removeListener(fn) {
    const id = this.listeners.indexOf(fn);
    this.listeners.splice(id, 1);
  }

  withStore(WrappedComponent) {
    return withStore(WrappedComponent, this);
  }
}

export default Store;
