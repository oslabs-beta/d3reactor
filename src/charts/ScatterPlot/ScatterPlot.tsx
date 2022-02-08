/** App.js */
import React, { useState, useMemo } from 'react';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { useResponsive } from '../../hooks/useResponsive';
import { Axis } from '../../components/ContinuousAxis';
import { Circle } from '../../components/Circle';
import { ColorLegend } from '../../components/ColorLegend';
import { d3Voronoi } from '../../functionality/voronoi';
import { xScaleDef } from '../../functionality/xScale';
import { yScaleDef } from '../../functionality/yScale';
import { VoronoiWrapper } from '../../components/VoronoiWrapper';
import Tooltip from '../../components/Tooltip';
import {
  ScatterPlotProps,
  xAccessorFunc,
  yAccessorFunc,
  Data,
  toolTipState,
} from '../../../types';
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  inferXDataType,
  EXTRA_LEGEND_MARGIN,
  themes,
} from '../../utils';
import { Label } from '../../components/Label';

import { ThemeProvider } from 'styled-components';

export default function ScatterPlot({
  theme = 'light',
  data,
  height = '100%',
  width = '100%',
  xKey,
  xDataType,
  yKey,
  groupBy,
  xAxis = 'bottom',
  yAxis = 'left',
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  legend,
  legendLabel = '',
  chartType = 'scatter-plot',
  colorScheme = 'schemePurples',
  tooltipVisible = true,
}: ScatterPlotProps<string | number>): JSX.Element {
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
  let xType: 'number' | 'date' = inferXDataType(data[0], xKey);
  if (xDataType !== undefined) xType = xDataType;

  const keys = useMemo(() => {
    const groupAccessor = (d: Data) => d[groupBy ?? ''];
    const groups = d3.group(data, groupAccessor);
    return groupBy ? Array.from(groups).map((group) => group[0]) : [yKey];
  }, [groupBy, yKey, data]);

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

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

  const translate = `translate(${margin.left}, ${margin.top})`;

  // ********************
  // STEP 3. Create scales
  // Create scales for every data-to-pysical attribute in our chart
  // ********************

  const { xScale } = useMemo(() => {
    return xScaleDef(data, xType, xAccessor, margin, cWidth, chartType);
  }, [data, cWidth, margin]);

  const xAccessorScaled = (d: any) => xScale(xAccessor(d));

  const yScale = useMemo(() => {
    return yScaleDef(data, yAccessor, margin, cHeight, 'scatter-plot');
  }, [data, yAccessor, margin, cHeight]);

  const yAccessorScaled = (d: any) => yScale(yAccessor(d));
  // ********************
  // STEP 4. Define styles
  // Define how the data will drive your design
  // ********************

  // discreteColors must be between 3 and 9, so here we create a range.
  const numberOfKeys = Array.from(keys).length;
  const discreteColors =
    numberOfKeys < 4 ? 3 : Math.min(Array.from(keys).length, 9);
  const computedScheme = Array.from(
    d3[`${colorScheme}`][discreteColors]
  ).reverse();
  const colorScale = d3.scaleOrdinal(computedScheme);
  colorScale.domain(keys);

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

  // ********************
  // STEP 6. Set up interactions
  // Initialize event listeners and create interaction behavior
  // ********************

  const [tooltip, setTooltip] = useState<false | toolTipState>(false);

  const voronoi = useMemo(() => {
    return d3Voronoi(
      data,
      xScale,
      yScale,
      xAccessor,
      yAccessor,
      cHeight,
      cWidth,
      margin
    );
  }, [data, xScale, yScale, xAccessor, yAccessor, cHeight, cWidth, margin]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <div ref={anchor} style={{ width: width, height: height }}>
        {tooltipVisible && tooltip && (
          <Tooltip
            theme={theme}
            chartType="scatter-plot"
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
        <svg width={cWidth} height={cHeight}>
          <g className="spbody" transform={translate}>
            {yAxis && (
              <Axis
                theme={theme}
                chartType={chartType}
                x={yAxisX}
                y={yAxisY}
                yGrid={yGrid}
                height={cHeight}
                width={cWidth}
                margin={margin}
                scale={yScale}
                type={yAxis}
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
                xGrid={xGrid}
                height={cHeight}
                width={cWidth}
                margin={margin}
                scale={xScale}
                type={xAxis}
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
            {data.map((element: any, i: number) =>
              !groupBy ? (
                <Circle
                  key={i}
                  cx={xAccessorScaled(element)}
                  cy={yAccessorScaled(element)}
                  r="5"
                  color={colorScale(keys[1])}
                />
              ) : (
                <Circle
                  key={i}
                  cx={xAccessorScaled(element)}
                  cy={yAccessorScaled(element)}
                  r="5"
                  color={colorScale(element[groupBy])}
                />
              )
            )}
            {voronoi && (
              <VoronoiWrapper
                data={data}
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
