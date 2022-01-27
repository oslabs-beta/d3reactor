import React from 'react';
import { TooltipProps } from '../../types';

const Tooltip = ({
  chartType,
  data,
  cursorX,
  cursorY,
  distanceFromTop,
  distanceFromRight,
  distanceFromLeft,
  xKey,
  yKey,
}: TooltipProps): JSX.Element => {
  // ********************
  // TOOLTIP STYLES
  // ********************

  const backgroundColor = '#fff';
  const boarderColor = '#ddd';
  const triangleSize = 12;
  const shadowElevationHigh = `0 0 10px 0 rgba(80, 80, 80, 0.2)`;

  // If the tooltip is too close to the top of the screen we will position the
  // tooltip below the cursor.
  let contentTranslation = '';
  let triangleTranslation = '';
  let triangleBorderTranslation = '';
  // The tooltip is too close to the top of the screen
  let moveTooltip: { vertical: string; horizontal: string } = {
    vertical: 'none',
    horizontal: 'none',
  };
  if (distanceFromTop < 60) {
    moveTooltip = { ...moveTooltip, vertical: 'down' };
  }

  if (distanceFromLeft < 70) {
    moveTooltip = { ...moveTooltip, horizontal: 'right' };
  } else if (distanceFromRight < 70) {
    moveTooltip = { ...moveTooltip, horizontal: 'left' };
  }

  // console.log('Tooltip distance from top ', distanceFromTop);
  // console.log('Tooltip distance from right ', distanceFromRight);
  // console.log('Tooltip distance from left ', distanceFromLeft);

  let contentYTranslation = '';
  let triangeYTranslation = '';
  let triangeBorderYTranslation = '';
  switch (moveTooltip.vertical) {
    case 'down':
      contentYTranslation = `calc(10% + ${triangleSize}px)`;
      triangeYTranslation = `calc(102% + ${triangleSize / 2}px)`;
      triangeBorderYTranslation = `calc(100% + ${triangleSize / 2}px)`;
      break;
    case 'none':
      contentYTranslation = `calc(-100% - ${triangleSize}px)`;
      triangeYTranslation = `calc(-102% - ${triangleSize / 2}px)`;
      triangeBorderYTranslation = `calc(-100% - ${triangleSize / 2}px)`;
  }

  let contentXTranslation = '';
  let triangeXTranslation = '';
  let triangeBorderXTranslation = '';
  switch (moveTooltip.horizontal) {
    case 'right':
      contentXTranslation = `-20%`;
      triangeXTranslation = `-50%`;
      triangeBorderXTranslation = `-50%`;
      break;
    case 'left':
      contentXTranslation = `-80%`;
      triangeXTranslation = `-50%`;
      triangeBorderXTranslation = `-50%`;
      break;
    case 'none':
      contentXTranslation = `-50%`;
      triangeXTranslation = `-50%`;
      triangeBorderXTranslation = `-50%`;
  }

  contentTranslation = `translate(${contentXTranslation}, ${contentYTranslation})`;
  triangleTranslation = `translate(${triangeXTranslation}, ${triangeYTranslation}) rotate(45deg)`;
  triangleBorderTranslation = `translate(${triangeBorderXTranslation}, ${triangeBorderYTranslation}) rotate(45deg)`;

  const tooltipWrapperStyle: React.CSSProperties | undefined = {
    left: cursorX,
    top: cursorY,
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
    minWidth: '140px',
    maxWidth: '240px',
    transform: contentTranslation,
    background: backgroundColor,
    textAlign: 'center',
    lineHeight: '1.4em',
    fontSize: '1em',
    border: `1px solid ${boarderColor}`,
    zIndex: '9',
    transition: 'all 0.1s ease-out',
    boxShadow: shadowElevationHigh,
    pointerEvents: 'none',
    // wordBreak: 'break-all',
  };

  const triangleStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    background: backgroundColor,
    transform: triangleTranslation,
    transformOrigin: 'center center',
    zIndex: '10',
    transition: 'all 0.1s ease-out',
    pointerEvents: 'none',
  };

  const triangleBorderStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    background: boarderColor,
    transform: triangleBorderTranslation,
    transformOrigin: 'center center',
    boxShadow: shadowElevationHigh,
    zIndex: '8',
    transition: 'all 0.1s ease-out',
    pointerEvents: 'none',
  };

  let xValString = data[xKey as string];
  if (data[xKey as string] instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    xValString = `${xValString.getFullYear()}.${xValString.getMonth()}.${xValString.getDay()}`;
  }

  let yValString = data[yKey as string];
  if (!isNaN(data[yKey as string])) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    yValString = `${Math.round(yValString * 100) / 100}`;
  }

  return (
    <div style={tooltipWrapperStyle} data-testid={`tooltip-${chartType}`}>
      <div style={contentStyle}>
        <div>
          {xKey} <strong>{xValString}</strong>
        </div>
        <div>
          {yKey} <strong>{yValString}</strong>
        </div>
      </div>
      <div style={triangleStyle}></div>
      <div style={triangleBorderStyle}></div>
    </div>
  );
};

export default Tooltip;
