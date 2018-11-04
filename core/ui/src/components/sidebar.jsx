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

  &:before{
    content: '';
    display: block;
    position: relative;
    width: 10px;
    height: 10px;
    left: 22px;
    top: 22px;
    background: rgb(136, 74, 255);
  }
`;

const IconBar = props => (
  <Icons>
    {props.icons.map(icon => <Icon key={icon.name} icon={icon} />)}
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
    this.setState({ active });
  }

  render(){
    const children = React.Children.toArray(this.props.children);
    const icons = children.map(c => c.type.navigation);
    const active = children.find(c => c.type.navigation.name === this.state.active);
    return(
      <Container>
        <IconBar icons={icons} setActivePanel={this.setActivePanel} />
        {active}
      </Container>
    )
  }

}

export default Sidebar;
