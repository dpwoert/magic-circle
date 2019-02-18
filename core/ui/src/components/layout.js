import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import Header from './header';
import Sidebar from './sidebar';

class Layout extends Component {
  hook(name, position) {
    const { plugins } = this.props.client;
    return plugins.map(p => {
      if (p[name]) {
        return p[name](position);
      }

      return null;
    });
  }

  render() {
    const HeaderWithStore = this.props.client.buttons.withStore(Header);
    const { icons } = this.props.client;
    return (
      <ThemeProvider theme={{ icons, ...this.props.client.settings.theme }}>
        <div>
          <HeaderWithStore
            left={this.hook('header', 'left')}
            center={this.hook('header', 'center')}
            right={this.hook('header', 'right')}
          />
          <Sidebar>{this.hook('sidebar')}</Sidebar>
          {this.hook('layout')}
        </div>
      </ThemeProvider>
    );
  }
}

export default Layout;
