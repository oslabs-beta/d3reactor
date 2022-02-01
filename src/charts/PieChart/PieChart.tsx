/** App.js */
import React, { useState, useMemo } from 'react';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { useResponsive } from '../../hooks/useResponsive';
import { PieChartProps, Data } from '../../../types';
import { ColorLegend } from '../../components/ColorLegend';
import { Arc } from '../../components/Arc';
import Tooltip from '../../components/Tooltip';
import {
  checkRadiusDimension,
  calculateOuterRadius,
  getMarginsWithLegend,
  EXTRA_LEGEND_MARGIN,
  themes,
} from '../../utils';

import styled, { ThemeProvider } from 'styled-components';

const PieLabel = styled.text`
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  text-anchor: middle;
  alignment-baseline: middle;
  fill: black;
  pointer-events: none;
`;

const { light, dark } = themes;

export default function PieChart({
  theme = 'light',
  data,
  innerRadius,
  label,
  legend,
  legendLabel,
  outerRadius,
  pieLabel,
  chartType = 'pie-chart',
  colorScheme = 'schemePurples',
  value,
  tooltipVisible = true,
}: PieChartProps): JSX.Element {
  /**********
  Step in creating any chart:
    1. Process data
    2. Determine chart dimensions
    3. Create scales
    4. Define styles
    5. Set up supportive elements
    6. Set up interactions
  ***********/

  // ********************
  // STEP 1. Process data
  // Look at the data structure and declare how to access the values we'll need.
  // ********************

  const keys = useMemo(() => {
    const groupAccessor = (d: Data) => d[label ?? ''];
    const groups: d3.InternMap<any, any[]> = d3.group(data, groupAccessor);
    return Array.from(groups).map((group) => group[0]);
  }, [label]);

  // ********************
  // STEP 2. Determine chart dimensions
  // Declare the physical (i.e. pixels) chart parameters
  // ********************

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

  // ********************
  // STEP 3. Create scales
  // Create scales for every data-to-pysical attribute in our chart
  // ********************

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

  const arcGenerator: any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const pieGenerator: any = d3
    .pie()
    .padAngle(0)
    .value((d: any) => d[value]);

  const pie: any = pieGenerator(data);
  const propsData = useMemo(
    () =>
      pie.map((d: any) => ({ [label]: d.data[label], [value]: d.data[value] })),
    [data]
  );

  // ********************
  // STEP 4. Define styles
  // Define how the data will drive your design
  // ********************

  const discreteColors = Math.min(keys.length, 9);
  const computedScheme = d3[`${colorScheme}`][discreteColors];
  const colorScale = d3.scaleOrdinal(Array.from(computedScheme).reverse());
  colorScale.domain(keys);

  // ********************
  // STEP 5. Set up supportive elements
  // Render your axes, labels, legends, annotations, etc.
  // ********************

  const textTranform = (d: any) => {
    const [x, y]: number[] = arcGenerator.centroid(d);
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

  // ********************
  // STEP 6. Set up interactions
  // Initialize event listeners and create interaction behavior
  // ********************

  const [tooltip, setTooltip] = useState<false | any>(false);

  return (
    <ThemeProvider theme={themes[theme]}>
      <div ref={anchor} style={{ width: '100%', height: '100%' }}>
        {tooltipVisible && tooltip && (
          <Tooltip
            theme={theme}
            chartType={chartType}
            data={tooltip.data}
            cursorX={tooltip.cursorX}
            cursorY={tooltip.cursorY}
            distanceFromTop={tooltip.distanceFromTop}
            distanceFromRight={tooltip.distanceFromRight}
            distanceFromLeft={tooltip.distanceFromLeft}
            xKey={label}
            yKey={value}
          />
        )}
        <svg width={'100%'} height={'100%'}>
          <g transform={translate} data-testid="pie-chart">
            {pie.map((d: any, i: number) => (
              <g key={`g + ${i}`}>
                <Arc
                  data={propsData[i]}
                  dataTestId={`pie-chart-arc-${i}`}
                  key={d.label}
                  fill={colorScale(keys[i])}
                  stroke="#ffffff"
                  strokeWidth="0px"
                  d={arcGenerator(d)}
                  id={`arc- + ${i}`}
                  setTooltip={setTooltip}
                />
                {pieLabel && (
                  <PieLabel
                    data-testid={`pie-chart-arc-text-${i}`}
                    transform={textTranform(d)}
                  >
                    {d.data[value]}
                  </PieLabel>
                )}
              </g>
            ))}
            {
              // If legend prop is truthy, render legend component:
              legend && (
                <ColorLegend
                  theme={theme}
                  legendLabel={legendLabel}
                  labels={keys}
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
    </ThemeProvider>
  );
}
