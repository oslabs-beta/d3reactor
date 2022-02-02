/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';

import { ArcProps } from '../../types';

export const Arc = React.memo(
  ({
    data,
    dataTestId = 'arc',
    fill = 'none',
    stroke,
    strokeWidth = '1px',
    d,
    setTooltip,
    margin,
    cWidth,
  }: ArcProps): JSX.Element => {
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
          cursorX: e.nativeEvent.pageX,
          cursorY: e.nativeEvent.pageY,
          distanceFromTop: e.nativeEvent.pageY - e.clientY + e.clientY,
          distanceFromRight: margin.left + cWidth + margin.right - cWidth,
          distanceFromLeft: e.pageX,
          data,
        };

        setTooltip(tooltipState);
      }
    };

    const onMouseLeave = () => {
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
        onMouseLeave={() => onMouseLeave()}
      />
    );
  }
);
