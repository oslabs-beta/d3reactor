/** App.js */
import React, { useState, useMemo } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { Axis } from '../../components/ContinuousAxis';
import { Line } from '../../components/Line';
import { VoronoiWrapper } from '../../components/VoronoiWrapper';
import {
  LineChartProps,
  xAccessorFunc,
  yAccessorFunc,
  GroupAccessorFunc,
  Data,
} from '../../../types';
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  inferXDataType,
  EXTRA_LEGEND_MARGIN,
} from '../../utils';
import { ColorLegend } from '../../components/ColorLegend';
import { yScaleDef } from '../../functionality/yScale';
import { xScaleDef } from '../../functionality/xScale';
import { d3Voronoi } from '../../functionality/voronoi';
import { Label } from '../../components/Label';
import Tooltip from '../../components/Tooltip';

export default function LineChart({
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

  // if no xKey datatype is passed in, determine if it's Date
  let xType: 'number' | 'date' = inferXDataType(data[0], xKey);
  if (xDataType !== undefined) xType = xDataType;

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

  // Null values must be removed from the dataset so as to not break our the
  // Line generator function.
  const cleanData = useMemo(() => {
    return data.filter((el) => el[yKey] !== null);
  }, [data]);

  const lineGroups: any = d3.group(data, (d) => d[groupBy ?? '']);

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
    return yScaleDef(data, yAccessor, margin, cHeight);
  }, [data, yAccessor, margin, cHeight]);

  const { xScale, xMin, xMax } = useMemo(() => {
    return xScaleDef(data, xType, xAccessor, margin, cWidth, chartType);
  }, [data, cWidth, margin]);

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

  const discreteColors =
    Array.from(keys).length < 4 ? 3 : Math.min(Array.from(keys).length, 9);
  const computedScheme = d3[`${colorScheme}`][discreteColors];
  const colorScale = d3.scaleOrdinal(Array.from(computedScheme).reverse());
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
    <div ref={anchor} style={{ width: width, height: height }}>
      {tooltip && (
        <Tooltip
          data={tooltip}
          x={margin.left + tooltip.cx}
          y={margin.top + tooltip.cy}
          xKey={xKey}
          yKey={yKey}
        />
      )}
      <svg width={cWidth} height={cHeight} data-testid="line-chart">
        <g transform={translate}>
          {yAxis && (
            <Axis
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
            />
          )}

          {
            // If legend prop is truthy, render legend component:
            legend && (
              <ColorLegend
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
  );
}
