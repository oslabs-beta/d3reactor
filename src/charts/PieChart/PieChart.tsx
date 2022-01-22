/** App.js */
import React, { useState, useMemo } from 'react';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { useResponsive } from '../../hooks/useResponsive';
import { PieChartProps, Data } from '../../../types';
import { ColorLegend } from '../../components/ColorLegend';
import { Arc } from '../../components/Arc';
import TooltipDiv from '../../components/TooltipDiv';
import {
  checkRadiusDimension,
  calculateOuterRadius,
  getMarginsWithLegend,
  EXTRA_LEGEND_MARGIN,
} from '../../utils';

export default function PieChart({
  data,
  innerRadius,
  label,
  legend,
  legendLabel,
  outerRadius,
  pieLabel,
  colorScheme = 'schemePurples',
  value,
}: PieChartProps): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false);

  const { anchor, cHeight, cWidth } = useResponsive();

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const xOffset = legendOffset[0];
  const yOffset = legendOffset[1];
  const margin = useMemo(
    () =>
      getMarginsWithLegend(
        false,
        false,
        undefined,
        undefined,
        legend,
        xOffset,
        yOffset,
        cWidth,
        cHeight
      ),
    [legend, xOffset, yOffset, cWidth, cHeight]
  );
  let ratio: number | undefined;
  if (
    typeof outerRadius === 'number' &&
    typeof innerRadius === 'number' &&
    innerRadius !== 0
  ) {
    ratio = innerRadius / outerRadius;
  }

  outerRadius = outerRadius
    ? checkRadiusDimension(cHeight, cWidth, outerRadius, margin, legend)
    : calculateOuterRadius(cHeight, cWidth, margin);

  if (outerRadius < 20) outerRadius = 20;

  if (ratio) {
    innerRadius = ratio * outerRadius;
  } else if (innerRadius) {
    const checkedRadiusDimension = checkRadiusDimension(
      cHeight,
      cWidth,
      innerRadius,
      margin,
      legend
    );
    innerRadius = checkedRadiusDimension > 0 ? checkedRadiusDimension : 0;
  } else innerRadius = 0;

  // type ColorScale = d3.ScaleOrdinal<string, string, never>;

  const keys = useMemo(() => {
    const groupAccessor = (d: Data) => d[label ?? ''];
    const groups: d3.InternMap<any, any[]> = d3.group(data, groupAccessor);
    return Array.from(groups).map((group) => group[0]);
  }, [label]);

  const discreteColors = Math.min(keys.length, 9);
  const computedScheme = d3[`${colorScheme}`][discreteColors];
  const colorScale = d3.scaleOrdinal(computedScheme);
  colorScale.domain(keys);

  const arcGenerator: any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const pieGenerator: any = d3
    .pie()
    .padAngle(0)
    .value((d: any) => d[value]);

  const pie: any = pieGenerator(data);

  const textTranform = (d: any) => {
    const [x, y] = arcGenerator.centroid(d);
    return `translate(${x}, ${y})`;
  };
  // Position of the legend
  let xPosition = outerRadius + EXTRA_LEGEND_MARGIN;
  let yPosition = EXTRA_LEGEND_MARGIN;
  // Offset position of the pie
  let translateX = 0;
  let translateY = 0;

  switch (legend) {
    case 'top':
      xPosition = -xOffset / 2 + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case 'bottom':
      xPosition = -xOffset / 2 + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 - EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case 'left':
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case 'top-left':
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius + margin.left / 2 + EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case 'bottom-left':
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius - margin.left / 2 - EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case 'left-top':
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case 'left-bottom':
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 - EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case 'right-top':
      xPosition = outerRadius - margin.top / 2 - EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case 'top-right':
      yPosition = -outerRadius + margin.right + EXTRA_LEGEND_MARGIN;
      translateX = -xOffset;
      break;
    case 'bottom-right':
      yPosition = outerRadius - margin.right + EXTRA_LEGEND_MARGIN;
      translateX = -xOffset;
      break;
    case 'right-bottom':
      xPosition = outerRadius - margin.bottom / 2 - EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 - EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case 'right':
    default:
      translateX = -xOffset;
      break;
  }

  const translate = `translate(${(cWidth + translateX) / 2}, ${
    (cHeight + translateY) / 2
  })`;

  return (
    <div ref={anchor} style={{ width: '100%', height: '100%' }}>
      {tooltip && (
        <TooltipDiv
          chartType="pie-chart"
          data={tooltip}
          x={tooltip.cx}
          y={tooltip.cy}
          xKey={label}
          yKey={value}
        />
      )}
      <svg width={'100%'} height={'100%'}>
        <g transform={translate} data-testid="pie-chart">
          {pie.map((d: any, i: number) => (
            <g key={'g' + i}>
              <Arc
                data={{ [label]: d.data[label], [value]: d.data[value] }}
                dataTestId={`pie-chart-arc-${i}`}
                key={d.label}
                fill={colorScale(keys[i])}
                stroke="#ffffff"
                strokeWidth="0px"
                d={arcGenerator(d)}
                id={'arc-' + i}
                setTooltip={setTooltip}
              />
              {pieLabel && (
                <text
                  data-testid={`pie-chart-arc-text-${i}`}
                  style={{ pointerEvents: 'none' }}
                  transform={textTranform(d)}
                  textAnchor={'middle'}
                  alignmentBaseline={'middle'}
                  fill={'black'}
                >
                  {d.data[value]}
                </text>
              )}
            </g>
          ))}
          {
            // If legend prop is truthy, render legend component:
            legend && (
              <ColorLegend
                legendLabel={legendLabel}
                circleRadius={5 /* Radius of each color swab in legend */}
                colorScale={colorScale}
                dataTestId="pie-chart-legend"
                setLegendOffset={setLegendOffset}
                legendPosition={legend}
                legendWidth={xOffset}
                legendHeight={yOffset}
                xPosition={xPosition}
                yPosition={yPosition}
                margin={margin}
                cWidth={cWidth / 2}
                cHeight={cHeight / 2}
                EXTRA_LEGEND_MARGIN={EXTRA_LEGEND_MARGIN}
              />
            )
          }
        </g>
      </svg>
    </div>
  );
}
