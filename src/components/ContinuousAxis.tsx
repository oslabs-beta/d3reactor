import React from 'react';
import * as d3 from 'd3';
import { ContinuousAxisProps } from '../../types';
import { gridGenerator } from '../functionality/grid';

import styled from 'styled-components';

const TickText = styled.text`
  font-size: 12px;
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  fill: ${(props) => props.theme.textColor};
`;

const AxisBaseline = styled.line`
  stroke: ${(props) => props.theme.axisBaseLineColor};
  stroke-width: 2;
`;

function Axi({
  theme = 'light',
  dataTestId = 'd3reactor-continuous',
  x,
  y,
  scale,
  type,
  width,
  height,
  margin,
  xGrid,
  yGrid,
  xTicksValue,
  chartType,
}: ContinuousAxisProps): JSX.Element {
  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;
  switch (type) {
    case 'bottom':
      x1 = x;
      y1 = y;
      x2 = width - margin.right - margin.left;
      if (x2 < 40) x2 = 40;
      y2 = y;
      break;
    case 'top':
      x1 = x;
      y1 = y;
      x2 = width - margin.right - margin.left;
      if (x2 < 40) x2 = 40;
      y2 = y;
      break;
    case 'left':
      x1 = x;
      y1 = 0;
      x2 = x;
      y2 = height - margin.top - margin.bottom;
      if (y2 < 40) y2 = 40;
      break;
    case 'right':
      x1 = x;
      y1 = y;
      x2 = x;
      y2 = height - margin.top - margin.bottom;
      if (y2 < 40) y2 = 40;
      break;
    default:
      x1 = 0;
      y1 = 0;
      x2 = 0;
      y2 = 0;
      break;
  }

  const getTickTranslation = (
    axisType: string,
    individualTick: number | Date
  ): string => {
    switch (axisType) {
      case 'top':
        return `translate(${scale(individualTick)}, ${y - 8})`;
      case 'right':
        return `translate(${x + 12}, ${scale(individualTick)})`;
      case 'bottom':
        return `translate(${scale(individualTick)}, ${y + 18})`;
      case 'left':
        return `translate(${x - 12}, ${scale(individualTick)})`;
      default:
        return `translate(0,0)`;
    }
  };

  const getTickStyle = (axisType: string): any => {
    // TODO remove any
    switch (axisType) {
      case 'top':
        return { textAnchor: 'middle', dominantBaseline: 'auto' };
      case 'right':
        return { textAnchor: 'start', dominantBaseline: 'middle' };
      case 'bottom':
        return { textAnchor: 'middle', dominantBaseline: 'auto' };
      case 'left':
        return { textAnchor: 'end', dominantBaseline: 'middle' };
    }
  };

  const grid = gridGenerator(
    theme,
    type,
    xGrid,
    yGrid,
    xTicksValue,
    scale,
    height,
    width,
    margin
  );

  let numberOfHorizontalTicks: number;
  if (width < 480) {
    numberOfHorizontalTicks = width / 100;
  } else if (width < 769) {
    numberOfHorizontalTicks = width / 120;
  } else if (width < 1024) {
    numberOfHorizontalTicks = width / 140;
  } else {
    numberOfHorizontalTicks = width / 160;
  }

  const numberOfVerticalTicks: number = height / 100;
  const horizontalTicks = scale.ticks(numberOfHorizontalTicks);
  const verticalTicks = scale.ticks(numberOfVerticalTicks);

  const formatTick = d3.timeFormat('%x');

  const getFormattedTick = (individualTick: number | Date) => {
    if (typeof individualTick === 'number') {
      return individualTick;
    } else {
      return formatTick(individualTick);
    }
  };

  return (
    <g>
      <g transform={`translate(${x}, ${y})`}>{grid}</g>
      {(type === 'top' ||
        type === 'bottom' ||
        chartType === 'scatter-plot') && (
        <AxisBaseline
          data-testid={dataTestId}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      )}
      {(type === 'top' || type === 'bottom') &&
        horizontalTicks.map((tick) => (
          <TickText
            data-testid="d3reactor-ticktext"
            key={JSON.stringify(tick)}
            style={getTickStyle(type)}
            transform={getTickTranslation(type, tick)}
          >
            {getFormattedTick(tick)}
          </TickText>
        ))}
      {(type === 'right' || type === 'left') &&
        verticalTicks.map((tick) => (
          <TickText
            data-testid="d3reactor-ticktext"
            key={JSON.stringify(tick)}
            style={getTickStyle(type)}
            transform={getTickTranslation(type, tick)}
          >
            {getFormattedTick(tick)}
          </TickText>
        ))}
    </g>
  );
}

function AxisPropsAreEqual(
  prevAxis: ContinuousAxisProps,
  newAxis: ContinuousAxisProps
) {
  return (
    prevAxis.scale === newAxis.scale &&
    prevAxis.height === newAxis.height &&
    prevAxis.width === newAxis.width
  );
}

export const Axis = React.memo(Axi, AxisPropsAreEqual);
