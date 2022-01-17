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
}: VoronoiProps): JSX.Element => {
  const onMouseMove = (e: any) => {
    if (cellCenter) {
      cellCenter.cy =
        e.nativeEvent.pageY - e.nativeEvent.offsetY + cellCenter.cy;
      cellCenter.cx =
        e.nativeEvent.pageX - e.nativeEvent.offsetX + cellCenter.cx;
    }
    setTooltip ? setTooltip(cellCenter) : null;
  };

  const onMouseOut = (e: any) => {
    if (cellCenter) {
      cellCenter.cy =
        cellCenter.cy - e.nativeEvent.pageY + e.nativeEvent.offsetY;
      cellCenter.cx =
        cellCenter.cx - e.nativeEvent.pageX + e.nativeEvent.offsetX;
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
