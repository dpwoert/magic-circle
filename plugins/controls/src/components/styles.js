import styled from 'styled-components';

export const Row = styled.div`
  position: relative;
  display: flex;
  padding: 10px;
  flex-direction: row;
  align-items: stretch;
  border-bottom: 1px solid #222;
`;

export const Label = styled.div`
  display: flex;
  width: 70px;
  font-size: 11px;
  justify-content: flex-start;
  align-items: center;
  padding: 0 3px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: ${props => props.right ? 'flex-end' : 'flex-start'};
  font-size: 12px;
`;

export const Value = styled.div`
  display: flex;
  width: 30px;
  font-size: 11px;
  justify-content: flex-start;
  align-items: center;
  padding-left: 6px;
`;

export const TextBox = styled.input`
  width: 100%;
  background: #191919;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 6px;
`;

export const Selection = styled.select`
  width: 100%;
  background: #191919;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 6px;
  height: 25px;
`;
