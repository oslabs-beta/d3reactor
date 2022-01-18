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
  const tooltipWrapperStyle: React.CSSProperties | undefined = {
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    pointerEvents: 'none',
  };

  const backgroundColor = '#fff';
  const boarderColor = '#ddd';
  const pointerSize = 12;
  const shadowElevationHigh = `0 0 10px 0 rgba(80, 80, 80, 0.2)`;

  const contentStyle: React.CSSProperties | undefined = {
    position: 'absolute',
    margin: '4px 4px',
    padding: '0.6em 1em',
    borderRadius: '4px',
    maxWidth: '380px',
    transform: `translate(-50%, calc(-100% - ${pointerSize + 4}px)`,
    background: backgroundColor,
    textAlign: 'center',
    lineHeight: '1.4em',
    fontSize: '0.9em',
    color: '#1e2023',
    border: `1px solid ${boarderColor}`,
    zIndex: '9',
    transition: 'all 0.1s ease-out',
    boxShadow: shadowElevationHigh,
    pointerEvents: 'none',
  };

  const triangleStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${pointerSize}px`,
    height: `${pointerSize}px`,
    background: backgroundColor,
    transform: `translate(-50%, calc(-102% - ${
      pointerSize / 2
    }px)) rotate(45deg)`,
    transformOrigin: 'center center',
    zIndex: '10',
    pointerEvents: 'none',
  };

  const triangleBorderStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${pointerSize}px`,
    height: `${pointerSize}px`,
    background: boarderColor,
    transform: `translate(-50%, calc(-100% - ${
      pointerSize / 2
    }px)) rotate(45deg)`,
    transformOrigin: 'center center',
    boxShadow: '1px 1px 14px 0px rgba(0,0,0,0.2)',
    zIndex: '8',
    pointerEvents: 'none',
  };

  const circleStyle: React.CSSProperties | undefined = {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    border: '1px solid #0184c7',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f0f9ff',
    boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.15)',
    pointerEvents: 'none',
  };

  const xTooltipText = `${xKey}: ${data.tooltipData[xKey as string]}`;
  const yTooltipText = `${yKey}: ${data.tooltipData[yKey as string]}`;

  return (
    <div style={tooltipWrapperStyle} data-test-id={`tooltip-${chartType}`}>
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
