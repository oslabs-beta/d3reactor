/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState, useEffect } from 'react';
import { VoronoiProps } from '../../types';
import useWindowDimensions from '../hooks/useWindowDimensions';

export const VoronoiCell = ({
  fill,
  stroke,
  opacity,
  d,
  cellCenter,
  setTooltip,
  data,
  margin,
}: VoronoiProps): JSX.Element => {
  const { width } = useWindowDimensions();
  // const [scrollPosition, setScrollPosition] = useState(0);

  // const handleScroll = () => {
  //   const position = window.pageYOffset;
  //   setScrollPosition(position);
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const tooltipState = {
    cursorX: 0,
    cursorY: 0,
    distanceFromTop: 0,
    distanceFromRight: 0,
    distanceFromLeft: 0,
    data,
  };

  const onMouseMove = (e: any) => {
    const tooltipState = {
      cursorX: e.nativeEvent.pageX - e.nativeEvent.layerX + cellCenter.cx,
      cursorY: e.nativeEvent.pageY - e.nativeEvent.layerY + cellCenter.cy,
      distanceFromTop: 0,
      distanceFromRight: 0,
      distanceFromLeft: 0,
      data,
    };

    tooltipState.distanceFromTop =
      tooltipState.cursorY + margin.top;
    tooltipState.distanceFromRight =
      width - (margin.left + tooltipState.cursorX);
    tooltipState.distanceFromLeft = margin.left + tooltipState.cursorX;

    setTooltip ? setTooltip(tooltipState) : null;
  };

  const onMouseOut = (e: any) => {
    if (tooltipState) {
      tooltipState.cursorY =
        tooltipState.cursorY - e.nativeEvent.pageY + e.nativeEvent.offsetY;
      tooltipState.cursorX =
        tooltipState.cursorX - e.nativeEvent.pageX + e.nativeEvent.offsetX;
    }
    setTooltip ? setTooltip(false) : null;
  };

  return (
    <path
      fill={fill}
      stroke={stroke}
      pointerEvents="all"
      opacity={opacity}
      d={d}
      onMouseOver={(e) => onMouseMove(e)}
      onMouseOut={(e) => onMouseOut(e)}
    ></path>
  );
};
