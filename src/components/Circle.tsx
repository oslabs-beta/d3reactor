import React from 'react';
import { CircleProps } from '../../types';

export const Circle = React.memo(
  ({ cx, cy, r = 4, color }: CircleProps): JSX.Element => {
    return <circle cx={cx} cy={cy} r={r} fill={color} stroke={color} />;
  }
);
