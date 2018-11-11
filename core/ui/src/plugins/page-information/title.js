import React, { Component } from 'react';
import styled from 'styled-components';

import withPageInfo from './with-page-info';

const Container = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  min-width: 50px;
`;

const truncate = (string, max) => {
  return string.length > max ? string.substring(0,max)+'...' : string;
};

class Title extends Component {

  render(){
    const {title, nodeEnv} = this.props.info;
    const display = title && title.length > 0 ?
      `${truncate(title || '', 25)} (${nodeEnv})` : 'no page loaded';

    console.log('title', title)
    return(
      <Container>
        {display}
      </Container>
    )
  }

}

export default withPageInfo(Title);
