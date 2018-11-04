import React, { Component, Fragment } from 'react';
import Header from './header';
import Sidebar from './sidebar';

class Layout extends Component {

  hook(name, position){
    const { plugins } = this.props.client;
    return plugins.map(p => {
      if(p[name]){
        return p[name](position);
      }
    });
  }

  render(){
    return(
      <div>
        <Header
          left={this.hook('header', 'left')}
          center={this.hook('header', 'center')}
          right={this.hook('header', 'right')}
        />
        <Sidebar>
          { this.hook('sidebar') }
        </Sidebar>
        { this.hook('layout') }
      </div>
    )
  }

}

export default Layout;
