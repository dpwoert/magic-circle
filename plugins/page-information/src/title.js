import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  min-width: 50px;
`;

const truncate = (string, max) =>
  string.length > max ? `${string.substring(0, max)}...` : string;

const Title = props => {
  const { title, nodeEnv } = props;
  const display =
    title && title.length > 0
      ? `${truncate(title || '', 25)} (${nodeEnv})`
      : 'no page loaded';
  return <Container>{display}</Container>;
};

export default Title;
