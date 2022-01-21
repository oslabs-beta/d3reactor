import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { DiscreteAxisProps, Data } from '../../types';
export const DiscreteAxis = React.memo(
  ({
    dataTestId = 'discrete-axis',
    x,
    y,
    scale,
    type,
    label,
    width,
    height,
    margin,
    data,
    layers,
    xAccessor,
    setTickMargin,
  }: DiscreteAxisProps): JSX.Element => {
    const fontSize = 11;
    let x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0;
    switch (type) {
      case 'bottom':
        x1 = x;
        y1 = y;
        x2 = width - margin.right - margin.left;
        y2 = y;
        break;
      case 'top':
        x1 = x;
        y1 = y;
        x2 = width - margin.right - margin.left;
        y2 = y;
        break;
      default:
        x1 = 0;
        y1 = 0;
        x2 = 0;
        y2 = 0;
        break;
    }
    const formatTick = d3.timeFormat('%x');
    const getFormattedTick = (individualTick: string) => {
      if (individualTick.length > 10 && !isNaN(Date.parse(individualTick))) {
        return formatTick(new Date(individualTick));
      } else {
        return individualTick;
      }
    };
    const ticksOriginal = data.map((d) => xAccessor(d));
    const ticks = data.map((d) => getFormattedTick(xAccessor(d)));
    const check = ticks.some((tick) => tick.length * 9 > scale.bandwidth());
    const longestTick = ticks.reduce((a, b) => (a.length > b.length ? a : b));
    useEffect(() => {
      check
        ? setTickMargin((longestTick.length * fontSize) / 2)
        : setTickMargin(0);
    }, [check]);
    const getTickTranslation = (
      axisType: string,
      individualTick: string,
      i: number
    ): string => {
      switch (axisType) {
        case 'top':
          return check
            ? `translate(${
                scale.bandwidth() / 2 + (scale(ticksOriginal[i]) ?? 0)
              }, ${y - fontSize})`
            : `translate(${
                scale.bandwidth() / 2 + (scale(ticksOriginal[i]) ?? 0)
              }, ${y - fontSize})`;
        case 'bottom':
          return check
            ? `translate(${
                scale.bandwidth() / 2 +
                (scale(ticksOriginal[i]) ?? 0) +
                fontSize / 2
              }, ${y + (individualTick.length / 2) * fontSize}), rotate(-90)`
            : `translate(${
                scale.bandwidth() / 2 + (scale(ticksOriginal[i]) ?? 0)
              }, ${y + fontSize * 2})`;
        default:
          return `translate(0,0)`;
      }
    };
    const getTickStyle = (
      axisType: string,
      individualTick: Data
    ): { [key: string]: string } | undefined => {
      switch (axisType) {
        case 'top':
          return { textAnchor: 'middle', dominantBaseline: 'auto' };
        case 'bottom':
          return { textAnchor: 'middle', dominantBaseline: 'auto' };
      }
    };
    // const horizontalTicks = scale.ticks(width/120)
    // const verticalTicks = scale.ticks(numberOfVerticalTicks)
    return (
      <g>
        <line
          className="axis-baseline"
          data-testid={dataTestId}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
        {ticks.map((tick: any, i: number) => (
          <text
            className="tick-text"
            key={i}
            style={getTickStyle(type, tick)}
            transform={getTickTranslation(type, tick, i)}
          >
            {check ? tick.slice(0, 10) : tick}
          </text>
        ))}
      </g>
    );
  }
);
