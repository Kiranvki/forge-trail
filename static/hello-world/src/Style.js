import styled from 'styled-components';
import { colors, elevation } from '@atlaskit/theme';

export const Card = styled.div`
  background: ${colors.N0};
  position: relative;
  text-decoration: none;
  border-radius: 3px;
  margin: 4px 1px;
  height: calc(100vh - 10px);
  box-sizing: border-box;
`;

export const ScrollContainer = styled.div`
  overflow: auto;
  max-height: calc(100% - 40px);
`;

export const Row = styled.div`
  transition: .3s ease all;
  padding: 8px;
  border-bottom: 1px solid ${colors.N30};

  ${props => `
    ${props.isChecked ? 'text-decoration: line-through;' : ''}
    ${props.isCompact ? 'padding: 0 6px;' : ''}
    ${props.isCompact ? 'border: 0;' : ''}
  `}
`;

export const Form = styled.form`
  padding: 8px 0;
`;