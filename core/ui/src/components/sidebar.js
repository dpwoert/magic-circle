import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  bottom: 0;
  width: 250px;
  background: #111111;
  border-right: 1px solid #262626;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
`;

const Icons = styled.ul`
  width: 54px;
  height: 100%;
  border-right: 1px solid #262626;
`;

const Icon = styled.li`
  width: 54px;
  height: 54px;
  background-size: 40% auto;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url(${props => props.icon});
`;

const IconBar = props => (
  <Icons>
    {props.panels.map(panel => (
      <Icon
        key={panel.name}
        icon={panel.icon}
        onClick={() => props.setActivePanel(panel)}
      />
    ))}
  </Icons>
);

class Sidebar extends Component {

  constructor(props, context){
    super(props, context);

    // determine initial state
    const children = React.Children.toArray(this.props.children);
    const firstItem = children[0].type.navigation;
    this.state = { active: firstItem.name };

    // event binding
    this.setActivePanel = this.setActivePanel.bind(this);
  }

  setActivePanel(active){
    this.setState({ active: active.name });
  }

  render(){
    const children = React.Children.toArray(this.props.children);
    console.log(children, this.props.children);
    const panels = children.map(c => c.type.navigation);
    const active = children.find(c => c.type.navigation.name === this.state.active);
    return(
      <Container>
        <IconBar panels={panels} setActivePanel={this.setActivePanel} />
        {active}
      </Container>
    )
  }

}

export default Sidebar;
