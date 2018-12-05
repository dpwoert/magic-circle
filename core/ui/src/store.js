import React, {Component} from 'react';

const withStore = (WrappedComponent, store) =>
  class LayerProvider extends Component {

    static navigation = WrappedComponent.navigation;

    constructor(props, context){
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
      return <WrappedComponent set={store.set} {...data} {...this.props} />;
    }
  };


class Store {

  constructor(initialData = {}){
    this.listeners = [];
    this.data = initialData;

    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
  }

  get(key){
    console.log(this.data);
    return key ? this.data[key] : this.data;
  }

  set(key, value){
    this.data[key] = value;
    this.refresh();
  }

  refresh(){
    this.listeners.forEach(l => l(this.data));
  }

  addListener(fn){
    this.listeners.push(fn);
  }

  removeListener(fn){
    const id = listeners.indexOf(fn);
    listeners.splice(id, 1);
  }

  withStore(WrappedComponent){
    return withStore(WrappedComponent, this);
  }

}

export default Store;
