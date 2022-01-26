import React from 'react';
import { LineProps } from '../../types';

import styled from 'styled-components';

export const Line = React.memo(
  ({ fill = 'none', stroke, d }: LineProps): JSX.Element => {
    const Line = styled.path`
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    `;

    return (
      <Line
        className="line"
        data-testid="d3reactor-line"
        fill={fill}
        stroke={stroke}
        d={d}
      />
    );
  }
);
