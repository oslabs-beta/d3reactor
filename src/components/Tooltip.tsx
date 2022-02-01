/* eslint-disable import/default */
import React from 'react';
import { TooltipProps } from '../../types';
// eslint-disable-next-line import/namespace
// import TooltipContent from './TooltipContent.jsx';

const Tooltip = ({
  theme = 'light',
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

  const lightTheme = {
    strokeGridLineColor: '#ebebeb',
    textColor: '#212121',
    axisBaseLineColor: '#ebebeb',
    legendBackgroundColor: '#ffffff',
    legendBorder: '1px solid #ebebeb',
    tooltipTextColor: '#e5e5e5',
    tooltipBackgroundColor: '#ffffff',
    tooltipBorder: '1px solid #ddd',
    tooltipShadow: `0 0 10px 0 rgba(80, 80, 80, 0.2)`,
  };

  const darkTheme = {
    strokeGridLineColor: '#3d3d3d',
    textColor: '#727272',
    axisBaseLineColor: '#3d3d3d',
    legendBackgroundColor: '#1d1d1d',
    legendBorder: '1px solid #3d3d3d',
    tooltipTextColor: '#e5e5e5',
    tooltipBackgroundColor: '#383838',
    tooltipBorder: '1px solid #3d3d3d',
    tooltipShadow: `0 0 10px 0 rgba(100, 100, 100, 0.2)`,
  };

  const themes = {
    light: lightTheme,
    dark: darkTheme,
  };

  const triangleSize = 12;

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

  let contentYTranslation = '';
  let triangeYTranslation = '';
  let triangeBorderYTranslation = '';
  switch (moveTooltip.vertical) {
    case 'down':
      contentYTranslation = `calc(${triangleSize - 4}px)`;
      triangeYTranslation = `calc(${triangleSize / 2 + 2}px)`;
      triangeBorderYTranslation = `calc(${triangleSize / 2 + 0}px)`;
      break;
    case 'none':
      contentYTranslation = `calc(-102% - ${triangleSize}px)`;
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
  };

  const contentStyle: React.CSSProperties | undefined = {
    position: 'absolute',
    margin: '4px 4px',
    border: `6px solid ${themes[theme].tooltipBackgroundColor}`,
    borderRight: `12px solid ${themes[theme].tooltipBackgroundColor}`,
    borderBottom: `6px solid ${themes[theme].tooltipBackgroundColor}`,
    borderLeft: `12px solid ${themes[theme].tooltipBackgroundColor}`,
    padding: '0.6em 1em',
    borderRadius: '4px',
    minWidth: '140px',
    maxWidth: '240px',
    transform: contentTranslation,
    backgroundColor: `${themes[theme].tooltipBackgroundColor}`,
    textAlign: 'center',
    lineHeight: '1.4em',
    fontSize: '12px',
    color: `${themes[theme].tooltipTextColor}`,
    // border: `${themes[theme].tooltipBorder}`,
    zIndex: '9',
    transition: 'all 0.1s ease-out',
    boxShadow: `${themes[theme].tooltipShadow}`,
    pointerEvents: 'none',
    // wordBreak: 'break-all',
  };

  const triangleStyle: React.CSSProperties | undefined = {
    content: '',
    position: 'absolute',
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    backgroundColor: `${themes[theme].tooltipBackgroundColor}`,
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
    background: `${themes[theme].tooltipBackgroundColor}`,
    transform: triangleBorderTranslation,
    transformOrigin: 'center center',
    boxShadow: `${themes[theme].tooltipShadow}`,
    zIndex: '8',
    transition: 'all 0.1s ease-out',
    pointerEvents: 'none',
  };

  let xValString = data[xKey as string];
  if (data[xKey as string] instanceof Date) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    xValString = `${xValString.getFullYear()}-${xValString.getMonth()}-${xValString.getDay()}`;
  }

  let yValString = data[yKey as string];
  if (!isNaN(data[yKey as string])) {
    yValString = `${Math.round(yValString * 100) / 100}`;
  }

  return (
    <div
      className="tooltip"
      style={tooltipWrapperStyle}
      data-testid={chartType ? `tooltip-${chartType}` : 'tooltip'}
    >
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
