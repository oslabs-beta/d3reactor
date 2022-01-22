import React from 'react';
import { TooltipProps } from '../../types';

const TooltipDiv = ({
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
    color: '#737373',
  };

  const contentStyle: React.CSSProperties | undefined = {
    position: 'absolute',
    margin: '4px 4px',
    padding: '0.6em 1em',
    borderRadius: '4px',
    maxWidth: '280px',
    transform: `translate(-50%, calc(-100% - ${triangleSize + 4}px)`,
    background: backgroundColor,
    textAlign: 'left',
    lineHeight: '1.4em',
    fontSize: '1em',
    border: `1px solid ${boarderColor}`,
    zIndex: '9',
    transition: 'all 0.1s ease-out',
    boxShadow: shadowElevationHigh,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
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

  const circleStyle: React.CSSProperties | undefined = {
    // width: '4px',
    // height: '4px',
    // borderRadius: '50%',
    // border: '1px solid #0184c7',
    // position: 'absolute',
    // transform: 'translate(-50%, -50%)',
    // backgroundColor: '#f0f9ff',
    // boxShadow: shadowElevationHigh,
    pointerEvents: 'none',
  };

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

  const xTooltipText = `${xKey}: ${xValString}`;
  const yTooltipText = `${yKey}: ${yValString}`;

  return (
    <div style={tooltipWrapperStyle} data-testid={`tooltip-${chartType}`}>
      <div style={contentStyle}>
        {xTooltipText}
        <br />
        {yTooltipText}
      </div>
      <div style={triangleStyle}></div>
      <div style={triangleBorderStyle}></div>
      {chartType !== 'scatter-plot' && chartType !== 'pie-chart' && (
        <div style={circleStyle}></div>
      )}
    </div>
  );
};

export default TooltipDiv;
