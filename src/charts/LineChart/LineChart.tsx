/* eslint-disable @typescript-eslint/restrict-plus-operands */
/** App.js */
import React, { useState, useMemo } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { Axis } from '../../components/ContinuousAxis';
import { Line } from '../../components/Line';
import { VoronoiWrapper } from '../../components/VoronoiWrapper';
import { LineChartProps, xAccessorFunc, yAccessorFunc } from '../../../types';
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  inferXDataType,
  EXTRA_LEGEND_MARGIN,
  themes,
} from '../../utils';
import { ColorLegend } from '../../components/ColorLegend';
import { yScaleDef } from '../../functionality/yScale';
import { xScaleDef } from '../../functionality/xScale';
import { d3Voronoi } from '../../functionality/voronoi';
import { Label } from '../../components/Label';
import Tooltip from '../../components/Tooltip';

import { ThemeProvider } from 'styled-components';

export default function LineChart({
  theme = 'light',
  data,
  height = '100%',
  width = '100%',
  xKey,
  yKey,
  xDataType,
  groupBy,
  xAxis = 'bottom',
  yAxis = 'left',
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  legend,
  legendLabel = '',
  chartType = 'line-chart',
  colorScheme = 'schemePurples',
  tooltipVisible = true,
}: LineChartProps<string | number>): JSX.Element {
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

  // Null values must be removed from the dataset so as to not break our the
  // Line generator function.
  const cleanData = useMemo(
    () => data.filter((el) => el[xKey] !== null && el[yKey] !== null),
    [data]
  );

  // if no xKey datatype is passed in, determine if it's Date
  let xType: 'number' | 'date' = inferXDataType(cleanData[0], xKey);
  if (xDataType !== undefined) xType = xDataType;

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

  const lineGroups: any = d3.group(cleanData, (d) => d[groupBy ?? '']);

  let keys: string[] = [];
  if (groupBy !== undefined) {
    keys = Array.from(lineGroups).map((group: any) => group[0]);
  } else {
    keys = [yKey];
  }

  // ********************
  // STEP 2. Determine chart dimensions
  // Declare the physical (i.e. pixels) chart parameters
  // ********************

  // useResponsive is use to retrieve the height and width of the anchor element
  const { anchor, cHeight, cWidth } = useResponsive();

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const [xOffset, yOffset] = legendOffset;

  const margin = useMemo(
    () =>
      getMarginsWithLegend(
        xAxis,
        yAxis,
        xAxisLabel,
        yAxisLabel,
        legend,
        xOffset,
        yOffset,
        cWidth,
        cHeight
      ),
    [
      xAxis,
      yAxis,
      xAxisLabel,
      yAxisLabel,
      legend,
      xOffset,
      yOffset,
      cWidth,
      cHeight,
    ]
  );

  // With the margins we can now determine where the g element inside of our
  // SVG will be placed. So, we'll use margin to create our translation string
  const translate = `translate(${margin.left}, ${margin.top})`;

  // ********************
  // STEP 3. Create scales
  // Create scales for every data-to-pysical attribute in our chart
  // ********************

  const yScale = useMemo(() => {
    return yScaleDef(cleanData, yAccessor, margin, cHeight, 'line-chart');
  }, [cleanData, yAccessor, margin, cHeight]);

  const { xScale, xMin, xMax } = useMemo(() => {
    return xScaleDef(cleanData, xType, xAccessor, margin, cWidth, chartType);
  }, [cleanData, cWidth, margin]);

  const line: any = d3
    .line()
    .curve(d3.curveLinear)
    .x((d) => xScale(xAccessor(d)))
    .y((d: any) => {
      return d[yKey] ? yScale(yAccessor(d)) : yScale(0);
    });

  // ********************
  // STEP 4. Define styles
  // Define how the data will drive your design
  // ********************

  const numberOfKeys = Array.from(keys).length;
  const discreteColors =
    numberOfKeys < 4 ? 3 : Math.min(Array.from(keys).length, 9);
  const computedScheme = Array.from(
    d3[`${colorScheme}`][discreteColors]
  ).reverse();
  const colorScale = d3.scaleOrdinal(computedScheme);
  colorScale.domain(computedScheme);

  // ********************
  // STEP 5. Set up supportive elements
  // Render your axes, labels, legends, annotations, etc.
  // ********************

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, cHeight, margin),
    [cHeight, xAxis, margin]
  );

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, cWidth, margin),
    [cWidth, yAxis, margin]
  );

  const xTicksValue = [xMin, ...xScale.ticks(), xMax];

  // ********************
  // STEP 6. Set up interactions
  // Initialize event listeners and create interaction behavior
  // ********************

  const [tooltip, setTooltip] = useState<false | any>(false);

  const voronoi = useMemo(() => {
    return d3Voronoi(
      cleanData,
      xScale,
      yScale,
      xAccessor,
      yAccessor,
      cHeight,
      cWidth,
      margin
    );
  }, [
    cleanData,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    cHeight,
    cWidth,
    margin,
  ]);
  return (
    <ThemeProvider theme={themes[theme]}>
      <div ref={anchor} style={{ width: width, height: height }}>
        {tooltipVisible && tooltip && (
          <Tooltip
            theme={theme}
            data={tooltip.data}
            cursorX={margin.left + tooltip.cursorX}
            cursorY={margin.top + tooltip.cursorY}
            distanceFromTop={tooltip.distanceFromTop}
            distanceFromRight={tooltip.distanceFromRight}
            distanceFromLeft={tooltip.distanceFromLeft}
            xKey={xKey}
            yKey={yKey}
          />
        )}
        <svg width={cWidth} height={cHeight} data-testid="line-chart">
          <g transform={translate}>
            {yAxis && (
              <Axis
                theme={theme}
                x={yAxisX}
                y={yAxisY}
                height={cHeight}
                width={cWidth}
                margin={margin}
                scale={yScale}
                type={yAxis}
                yGrid={yGrid}
              />
            )}
            {yAxisLabel && (
              <Label
                theme={theme}
                x={yAxisX}
                y={yAxisY}
                height={cHeight}
                width={cWidth}
                margin={margin}
                type={yAxis ? yAxis : 'left'}
                axis={yAxis ? true : false}
                label={yAxisLabel}
              />
            )}

            {xAxis && (
              <Axis
                theme={theme}
                x={xAxisX}
                y={xAxisY}
                height={cHeight}
                width={cWidth}
                margin={margin}
                scale={xScale}
                type={xAxis}
                xGrid={xGrid}
                xTicksValue={xTicksValue}
              />
            )}
            {xAxisLabel && (
              <Label
                theme={theme}
                x={xAxisX}
                y={xAxisY}
                height={cHeight}
                width={cWidth}
                margin={margin}
                type={xAxis ? xAxis : 'bottom'}
                axis={xAxis ? true : false}
                label={xAxisLabel}
              />
            )}
            {groupBy ? (
              d3.map(lineGroups, (lineGroup: [string, []], i) => {
                return (
                  <Line
                    key={i}
                    fill="none"
                    stroke={colorScale(lineGroup[0])}
                    d={line(lineGroup[1])}
                  />
                );
              })
            ) : (
              <Line
                fill="none"
                stroke={colorScale(keys[0])}
                strokeWidth="1px"
                d={line(cleanData)}
              />
            )}
            {voronoi && (
              <VoronoiWrapper
                data={cleanData}
                voronoi={voronoi}
                xScale={xScale}
                yScale={yScale}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                setTooltip={setTooltip}
                margin={margin}
                cWidth={cWidth}
              />
            )}

            {
              // If legend prop is truthy, render legend component:
              legend && (
                <ColorLegend
                  theme={theme}
                  legendLabel={legendLabel}
                  labels={keys}
                  circleRadius={5 /* Radius of each color swab in legend */}
                  colorScale={colorScale}
                  setLegendOffset={setLegendOffset}
                  legendPosition={legend}
                  legendWidth={xOffset}
                  legendHeight={yOffset}
                  margin={margin}
                  cWidth={cWidth}
                  cHeight={cHeight}
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
