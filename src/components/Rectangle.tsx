/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { RectangleProps } from '../../types';
import useWindowDimensions from '../hooks/useWindowDimensions';

import styled from 'styled-components';
const Bar = styled.rect`
  fill-opacity: 0.7;
`;

export const Rectangle = React.memo(
  ({
    data,
    dataTestId = 'rectangle',
    x,
    y,
    width,
    height,
    margin,
    fill,
    setTooltip,
  }: RectangleProps): JSX.Element => {
    const clientWidth = useWindowDimensions().width;

    let tooltipState = {
      cursorX: 0,
      cursorY: 0,
      distanceFromTop: 0,
      distanceFromRight: 0,
      distanceFromLeft: 0,
      data,
    };

    const mouseOver = (e: any) => {
      // When the cursor enter the rectangle from the left we need to add half
      // of the bar width to the cursor position to calculate the distance from
      // right hand side of the page. When the cursor enters the bar from the
      // right side of the bar we need to substract half of the bar width.
      const offsetFromLeft = e.pageX - e.nativeEvent.layerX
      const cursorXPosition = offsetFromLeft + e.nativeEvent.layerX - margin.marginLeft;
      const rectMidPoint = (x ?? 0) + width / 2;

      if (setTooltip) {

        tooltipState = {
          cursorX: e.pageX - e.nativeEvent.layerX + (x ?? 0),
          cursorY: e.pageY - e.nativeEvent.layerY + (y ?? 0),
          distanceFromTop: e.clientY,
          distanceFromRight: clientWidth - (offsetFromLeft + margin.marginLeft + rectMidPoint),
          distanceFromLeft: e.pageX,
          data,
        };
        setTooltip(tooltipState);
      }
    };

    const mouseOut = (e: any) => {
      if (setTooltip) {
        setTooltip ? setTooltip(false) : null;
      }
    };

    return (
      <Bar
        data-testid={dataTestId}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseOver={(e) => mouseOver(e)}
        onMouseOut={(e) => mouseOut(e)}
      />
    );
  }
);
