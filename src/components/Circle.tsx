import React from 'react';
import { CircleProps } from '../../types';

import styled from 'styled-components';

const CircleComp = styled.circle`
  fill-opacity: 0.7;
  stroke-width: 1.4;
`;

export const Circle = React.memo(
  ({ cx, cy, r = '4', color }: CircleProps): JSX.Element => {
    return (
      <CircleComp
        data-testid="d3reactor-circle"
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke={color}
      />
    );
  }
);
