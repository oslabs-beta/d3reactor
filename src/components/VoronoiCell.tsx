/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { VoronoiProps } from '../../types';

export const VoronoiCell = ({
  fill,
  stroke,
  opacity,
  d,
  cellCenter,
  setTooltip,
  data,
  margin,
  cWidth,
}: VoronoiProps): JSX.Element => {
  // The code below was commented out because of the performance issues we ran
  // into when charts are taking in large data sets
  // TODO: Figure out how to performantly use scroll to improve the performance.
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
      cursorX: e.nativeEvent.pageX - e.nativeEvent.offsetX + cellCenter.cx,
      cursorY: e.nativeEvent.pageY - e.nativeEvent.offsetY + cellCenter.cy,
      distanceFromTop: 0,
      distanceFromRight: 0,
      distanceFromLeft: 0,
      data,
    };

    tooltipState.distanceFromTop = cellCenter.cy + margin.top;
    tooltipState.distanceFromRight =
      margin.left +
      cWidth +
      margin.right -
      (margin.left + tooltipState.cursorX);
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
