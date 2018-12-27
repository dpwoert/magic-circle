import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

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

const Button = styled.li`
  width: 54px;
  height: 54px;
  border-right: 2px solid ${props => props.selected ? props.theme.accent : 'rgba(0,0,0,0)'};

  fill: ${props => props.theme.accent};
  display: flex;
  justify-content: center;
  align-items: center;

  svg{
    width: 40%;
    height: auto;
  }
`;

const IconBar = withTheme(props => (
  <Icons>
    {props.panels.map(panel => {
      const Icon = typeof panel.icon === 'string' ?
        props.theme.icons[panel.icon] : panel.icon;
      return (
        <Button
          key={panel.name}
          icon={panel.icon}
          onClick={() => props.setActivePanel(panel)}
          selected={panel.name === props.active}
        >
          <Icon />
        </Button>
      );
    })}
  </Icons>
));

class Sidebar extends Component {

  constructor(props, context){
    super(props, context);

    // determine initial state
    const children = React.Children.toArray(this.props.children);
    const firstItem = children[0] ? children[0].type.navigation : {};
    this.state = { active: firstItem.name };

    // event binding
    this.setActivePanel = this.setActivePanel.bind(this);
  }

  setActivePanel(active){
    this.setState({ active: active.name });
  }

  render(){
    const children = React.Children.toArray(this.props.children);
    const panels = children.map(c => c.type.navigation);
    const active = children.find(c => c.type.navigation.name === this.state.active);
    return(
      <Container>
        <IconBar panels={panels} active={this.state.active} setActivePanel={this.setActivePanel} />
        {active}
      </Container>
    )
  }

}

export default Sidebar;
