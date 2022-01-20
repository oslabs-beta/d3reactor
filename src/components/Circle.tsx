import React from 'react';
import { CircleProps } from '../../types';

export const Circle = React.memo(
  ({ cx, cy, r = '4', color }: CircleProps): JSX.Element => {
    return (
      <circle
        data-testid='d3reactor-circle'
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={0.7}
        stroke={color}
        strokeWidth={1.4}
      />
    );
  }
);
