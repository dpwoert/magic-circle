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
