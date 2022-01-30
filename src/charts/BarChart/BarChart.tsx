/** App.js */
import React, { useState, useMemo } from 'react';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import { useResponsive } from '../../hooks/useResponsive';
import { Axis } from '../../components/ContinuousAxis';
import { DiscreteAxis } from '../../components/DiscreteAxis';
import { Rectangle } from '../../components/Rectangle';
import Tooltip from '../../components/Tooltip';
import { ColorLegend } from '../../components/ColorLegend';
import { transformSkinnyToWide } from '../../utils';
import {
  BarChartProps,
  Data,
  toolTipState,
  yAccessorFunc,
} from '../../../types';
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  EXTRA_LEGEND_MARGIN,
} from '../../utils';
import { yScaleDef } from '../../functionality/yScale';
import { Label } from '../../components/Label';

export default function BarChart({
  data,
  height = '100%',
  width = '100%',
  xKey,
  yKey,
  groupBy,
  xAxis = 'bottom',
  yAxis = 'left',
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  legend,
  legendLabel = '',
  chartType = 'bar-chart',
  colorScheme = 'schemePurples',
}: BarChartProps<string | number>): JSX.Element {
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

  const xAccessor: (d: Data) => string = useMemo(() => {
    return (d) => d[xKey];
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

  // When the yKey key has been assigned to the groupBy variable we know the user didn't specify grouping
  const keys: string[] = useMemo(() => {
    const groupAccessor = (d: Data) => d[groupBy ?? ''];
    const groups = d3.group(data, groupAccessor);
    return groupBy ? Array.from(groups).map((group) => group[0]) : [yKey];
  }, [groupBy, yKey]);

  const transData = useMemo(() => {
    return groupBy
      ? transformSkinnyToWide(data, keys, groupBy, xKey, yKey)
      : data;
  }, [data, keys, groupBy, xKey, yKey]);

  const stack = d3.stack().keys(keys).order(d3.stackOrderAscending);

  const layers = useMemo(() => {
    return stack(transData as Iterable<{ [key: string]: number }>);
  }, [transData]);

  const getSequenceData = (sequence: Data) => {
    const xKeyValue = { [xKey]: sequence.data[xKey] };
    const yKeyValue = { [yKey]: sequence[1] - sequence[0] };
    return { ...xKeyValue, ...yKeyValue };
  };

  let labelArray = [];
  if (typeof groupBy === 'string' && groupBy.length !== 0) {
    labelArray = layers.map((layer: { key: any }) => layer.key);
  } else {
    labelArray = [yKey];
  }

  // ********************
  // STEP 2. Determine chart dimensions
  // Declare the physical (i.e. pixels) chart parameters
  // ********************

  const { anchor, cHeight, cWidth } = useResponsive();

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);

  const [xOffset, yOffset] = legendOffset;

  const [tickMargin, setTickMargin] = useState(0);

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
        cHeight,
        tickMargin
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
      tickMargin,
    ]
  );
  const translate = `translate(${margin.left}, ${margin.top})`;

  // ********************
  // STEP 3. Create scales
  // Create scales for every data-to-pysical attribute in our chart
  // ********************

  const rangeMax = cWidth - margin.right - margin.left;

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(data.map(xAccessor))
      .range([0, rangeMax > 40 ? rangeMax : 40]);
  }, [transData, xAccessor, cWidth, margin]);

  const yScale = useMemo(() => {
    return yScaleDef(
      groupBy ? layers : transData,
      yAccessor,
      margin,
      cHeight,
      'bar-chart',
      groupBy
    );
  }, [transData, yAccessor, margin, cHeight, groupBy]);

  // ********************
  // STEP 4. Define styles
  // Define how the data will drive your design
  // ********************

  const discreteColors =
    Array.from(keys).length < 4 ? 3 : Math.min(Array.from(keys).length, 9);
  const computedScheme = d3[`${colorScheme}`][discreteColors];
  const colorScale = d3.scaleOrdinal(Array.from(computedScheme));
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

  return (
    <div ref={anchor} style={{ width: width, height: height }}>
      {tooltip && (
        <Tooltip
          chartType={chartType}
          data={tooltip.data}
          cursorX={tooltip.cursorX + xScale.bandwidth() / 2 + margin.left}
          cursorY={tooltip.cursorY + margin.top}
          distanceFromTop={tooltip.distanceFromTop}
          distanceFromRight={tooltip.distanceFromRight}
          distanceFromLeft={tooltip.distanceFromLeft}
          xKey={xKey}
          yKey={yKey}
        />
      )}
      <svg width={cWidth} height={cHeight} data-testid="bar-chart">
        <g transform={translate}>
          {xAxis && (
            <DiscreteAxis
              dataTestId="bar-chart-x-axis"
              x={xAxisX}
              y={xAxisY}
              width={cWidth}
              margin={margin}
              scale={xScale}
              type={xAxis}
              data={transData}
              xAccessor={xAccessor}
              setTickMargin={setTickMargin}
            />
          )}
          {yAxisLabel && (
            <Label
              dataTestId="bar-chart-y-axis-label"
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
          {yAxis && (
            <Axis
              dataTestId="bar-chart-y-axis"
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
          {xAxisLabel && (
            <Label
              dataTestId="bar-chart-x-axis-label"
              x={xAxisX}
              y={xAxisY}
              height={cHeight}
              width={cWidth}
              margin={margin}
              type={xAxis ? xAxis : 'bottom'}
              axis={xAxis ? true : false}
              label={xAxisLabel}
              tickMargin={tickMargin}
            />
          )}
          {groupBy
            ? layers.map(
                (
                  layer: Data,
                  i: number // MULTI CHART
                ) => (
                  <g key={i}>
                    {layer.map((sequence: Data, j: number) => (
                      <Rectangle
                        data={getSequenceData(sequence)}
                        dataTestId={`rectangle-${j}`}
                        key={j}
                        x={xScale(xAccessor(sequence.data))}
                        y={yScale(sequence[1])}
                        width={xScale.bandwidth()}
                        height={
                          yScale(sequence[0]) - yScale(sequence[1]) > 0
                            ? yScale(sequence[0]) - yScale(sequence[1])
                            : 0
                        }
                        margin={margin}
                        fill={colorScale(layer.key[i])}
                        setTooltip={setTooltip}
                      />
                    ))}
                  </g>
                )
              )
            : data.map((d: Data, i: number) => {
                return (
                  // SINGLE CHART
                  <Rectangle
                    data={d}
                    dataTestId={`rectangle-${i}`}
                    key={i}
                    x={xScale(xAccessor(d))}
                    y={
                      // if value < 0 mark, start rect top at 0 mark
                      yScale(0) - yScale(yAccessor(d)) > 0
                        ? yScale(yAccessor(d))
                        : yScale(0)
                    }
                    width={xScale.bandwidth()}
                    height={
                      // draw rect from 0 mark to +value
                      Math.abs(yScale(0) - yScale(yAccessor(d)))
                    }
                    margin={margin}
                    fill={colorScale(yKey)}
                    setTooltip={setTooltip}
                  />
                );
              })}

          {
            // If legend prop is truthy, render legend component:
            legend && (
              <ColorLegend
                legendLabel={legendLabel}
                labels={labelArray}
                circleRadius={5 /* Radius of each color swab in legend */}
                colorScale={colorScale}
                dataTestId="bar-chart-legend"
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
