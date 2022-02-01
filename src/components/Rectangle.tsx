/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { RectangleProps } from '../../types';

import styled from 'styled-components';
const Bar = styled.rect`
  fill-opacity: 0.7;
`;

const RectangleComp = ({
  data,
  dataTestId = 'rectangle',
  x,
  y,
  width,
  height,
  margin,
  cWidth,
  fill,
  setTooltip,
}: RectangleProps): JSX.Element => {

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
    const offsetFromLeft = e.pageX - e.nativeEvent.offsetX;
    const offsetFromTop = e.clientY - e.nativeEvent.offsetY;
    const rectMidPoint = (x ?? 0) + width / 2;
    const rectTop = y ?? 0;

    if (setTooltip) {
      tooltipState = {
        cursorX: e.pageX - e.nativeEvent.offsetX + (x ?? 0),
        cursorY: e.pageY - e.nativeEvent.offsetY + (y ?? 0),
        distanceFromTop: offsetFromTop + margin.top + rectTop,
        distanceFromRight:
          (margin.left + cWidth + margin.right) - (offsetFromLeft + margin.left + rectMidPoint),
        distanceFromLeft: offsetFromLeft + margin.left + rectMidPoint,
        data,
      };

      setTooltip(tooltipState);
    }
  };

  const mouseOut = () => {
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
      onMouseOut={() => mouseOut()}
    />
  );
};
const compareProps = (prev: RectangleProps, next: RectangleProps) => {
  return prev.x === next.x && prev.y === next.y && prev.margin === next.margin;
};

export const Rectangle = React.memo(RectangleComp, compareProps);
