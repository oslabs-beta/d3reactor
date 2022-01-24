import React from 'react';
import { TooltipProps } from '../../types';

const Tooltip = ({
  chartType,
  data,
  xAccessor,
  yAccessor,
  x,
  y,
  xKey,
  yKey,
}: TooltipProps): JSX.Element => {
  const backgroundColor = '#fff';
  const boarderColor = '#ddd';
  const triangleSize = 12;
  const shadowElevationHigh = `0 0 10px 0 rgba(80, 80, 80, 0.2)`;

  const tooltipWrapperStyle: React.CSSProperties | undefined = {
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    pointerEvents: 'none',
    fontFamily: 'Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '12px',
    color: '#737373',
  };

  const contentStyle: React.CSSProperties | undefined = {
    position: 'absolute',
    margin: '4px 4px',
    padding: '0.6em 1em',
    borderRadius: '4px',
    minWidth: '220px',
    transform: `translate(-50%, calc(-100% - ${triangleSize}px)`,
    background: backgroundColor,
    textAlign: 'left',
    lineHeight: '1.4em',
    fontSize: '1em',
    border: `1px solid ${boarderColor}`,
    zIndex: '9',
    transition: 'all 0.1s ease-out',
    boxShadow: shadowElevationHigh,
    pointerEvents: 'none',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  };

  const triangleStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    background: backgroundColor,
    transform: `translate(-50%, calc(-102% - ${
      triangleSize / 2
    }px)) rotate(45deg)`,
    transformOrigin: 'center center',
    zIndex: '10',
    pointerEvents: 'none',
  };

  const triangleBorderStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    background: boarderColor,
    transform: `translate(-50%, calc(-100% - ${
      triangleSize / 2
    }px)) rotate(45deg)`,
    transformOrigin: 'center center',
    boxShadow: shadowElevationHigh,
    zIndex: '8',
    pointerEvents: 'none',
  };

  // const isDate = function(date: Date | string | number) {
  //   return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
  // };

  let xValString = data.tooltipData[xKey as string];
  if (data.tooltipData[xKey as string] instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    xValString = `${xValString.getFullYear()}.${xValString.getMonth()}.${xValString.getDay()}`;
  }

  let yValString = data.tooltipData[yKey as string];
  if (!isNaN(data.tooltipData[yKey as string])) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    yValString = `${Math.round(yValString * 100) / 100}`;
  }

  return (
    <div style={tooltipWrapperStyle} data-testid={`tooltip-${chartType}`}>
      <div style={contentStyle}>
        {xKey} <strong>{xValString}</strong>
        <br />
        {yKey} <strong>{yValString}</strong>
      </div>
      <div style={triangleStyle}></div>
      <div style={triangleBorderStyle}></div>
    </div>
  );
};

export default Tooltip;
