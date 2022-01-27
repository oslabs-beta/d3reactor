import React from 'react';
import * as d3 from 'd3';

import { ArcProps } from '../../types';
import useWindowDimensions from '../hooks/useWindowDimensions';

export const Arc = React.memo(
  ({
    data,
    dataTestId = 'arc',
    key,
    fill = 'none',
    stroke,
    strokeWidth = '1px',
    d,
    setTooltip,
  }: ArcProps): JSX.Element => {
    const { width } = useWindowDimensions();

    let tooltipState = {
      cursorX: 0,
      cursorY: 0,
      distanceFromTop: 0,
      distanceFromRight: 0,
      distanceFromLeft: 0,
      data,
    };
    const onMouseMove = (e: any) => {
      if (setTooltip) {
        tooltipState = {
          cursorX: e.pageX,
          cursorY: e.pageY,
          distanceFromTop: e.clientY,
          distanceFromRight: width - e.clientX,
          distanceFromLeft: e.clientX,
          data,
        };
        setTooltip(tooltipState);
      }
    };

    const onMouseLeave = (e: any) => {
      if (setTooltip) {
        setTooltip ? setTooltip(false) : null;
      }
    };

    return (
      <path
        className="arc"
        data-testid={dataTestId}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={d}
        onMouseMove={(e) => onMouseMove(e)}
        onMouseLeave={(e) => onMouseLeave(e)}
      />
    );
  }
);
