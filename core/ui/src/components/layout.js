import React, { Component, Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import Header from './header';
import Sidebar from './sidebar';
import * as icons from '../icons';

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
      <ThemeProvider theme={{ icons, ...this.props.client.settings.theme }}>
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
      </ThemeProvider>
    )
  }

}

export default Layout;
