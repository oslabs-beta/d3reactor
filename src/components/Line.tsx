import React from 'react';
import { LineProps } from '../../types';

export const Line = React.memo(
  ({ fill = 'none', stroke, d }: LineProps): JSX.Element => {
    return (
      <path
        className="line"
        data-test-id="line"
        fill={fill}
        stroke={stroke}
        d={d}
      />
    );
  }
);
