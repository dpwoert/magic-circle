import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  .rc-color-picker-trigger{
    border: none;
    box-shadow: none;
    width: 24px;
  }

  .rc-color-picker-panel{
    background: #191919;
    color: white;
    margin-right: -6px;
  }

  .rc-color-picker-panel-params input{
    border: 1px solid #ababab;
    color: white;
    background: #6f6f6f;
  }

  .rc-color-picker-panel-inner{
    border-color: #000;
    box-shadow: 0 1px 5px #000;
  }
`;

export default GlobalStyle;
