import React from 'react';
import { CircleProps } from '../../types';

import styled from 'styled-components';

export const Circle = React.memo(
  ({ cx, cy, r = '4', color }: CircleProps): JSX.Element => {
    const Circle = styled.circle`
      fill-opacity: 0.7;
      stroke-width: 1.4;
    `;

    return (
      <Circle
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
