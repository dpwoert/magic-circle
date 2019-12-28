/* global window */
import React from 'react';

import Title from './title';
import URL from './url';

class PageInformation {
  static name = 'page-information';

  static initStore() {
    return {
      title: '',
      location: {},
    };
  }

  constructor(client, store) {
    this.client = client;
    this.store = store;

    this.changeUrl = this.changeUrl.bind(this);
    this.client.addListener('page-information', (evt, payload) =>
      this.setPageInfo(payload)
    );
  }

  buttons(buttons) {
    if (!this.client.isElectron) {
      buttons.set('breakFream', {
        icon: 'OpenInBrowser',
        collection: 'frame',
        click: () => this.openFrame(),
        touchbar: false,
      });
    }
  }

  openFrame() {
    const location = this.store.get('location');
    window.location.href = location.href;
  }

  setPageInfo(info) {
    this.store.set(info);
  }

  changeUrl(url) {
    this.client.sendAction('change-url', url);
  }

  header(position) {
    if (position === 'center') {
      const TitleWithStore = this.store.withStore(
        this.client.isElectron ? Title : URL
      );
      return <TitleWithStore changeUrl={this.changeUrl} key="title" />;
    }

    return false;
  }
}

export default PageInformation;
