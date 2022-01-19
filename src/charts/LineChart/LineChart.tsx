/** App.js */
import React, { useState, useMemo } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import * as d3 from 'd3';
import { Axis } from '../../components/ContinuousAxis';
import { Line } from '../../components/Line';
import { VoronoiWrapper } from '../../components/VoronoiWrapper';
import {
  LineChartProps,
  ColorScale,
  xAccessorFunc,
  yAccessorFunc,
  GroupAccessorFunc,
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
import TooltipDiv from '../../components/TooltipDiv';

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
  colorScheme = d3.quantize(d3.interpolateHcl('#003f5c', '#ffa600'), 10),
}: LineChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false);
  const chart = 'LineChart';

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

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, cHeight, margin),
    [cHeight, xAxis, margin]
  );

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, cWidth, margin),
    [cWidth, yAxis, margin]
  );

  const translate = `translate(${margin.left}, ${margin.top})`;

  let xType: 'number' | 'date' = inferXDataType(data[0], xKey);
  if (xDataType !== undefined) xType = xDataType;
  // if no xKey datatype is passed in, determine if it's Date

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

  const yScale = useMemo(() => {
    return yScaleDef(data, yAccessor, margin, cHeight);
  }, [data, yAccessor, margin, cHeight]);

  const { xScale, xMin, xMax } = useMemo(() => {
    return xScaleDef(data, xType, xAccessor, margin, cWidth, chart);
  }, [data, cWidth, margin]);

  const xTicksValue = [xMin, ...xScale.ticks(), xMax];

  // remove data entries with null values (which breaks line generator)
  data = data.filter((el) => {
    if (el[yKey] !== null) return el;
  });
  // generate unique keys to group by
  let keys: string[] = [];
  const groupAccessor: GroupAccessorFunc = (d) => {
    return d[groupBy ?? ''];
  };
  const lineGroups: any = d3.group(data, (d) => groupAccessor(d));
  keys = groupBy
    ? Array.from(lineGroups).map((group: any) => group[0])
    : [yKey];
  const line: any = d3
    .line()
    .curve(d3.curveLinear)
    .x((d) => xScale(xAccessor(d)))
    .y((d: any) => {
      return d[yKey] ? yScale(yAccessor(d)) : yScale(0);
    });

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

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme);
  colorScale.domain(keys);

  console.log('COLOR SCALE ', colorScale(keys[0]));
  return (
    <div ref={anchor} style={{ width: width, height: height }}>
      {tooltip && (
        <TooltipDiv
          data={tooltip}
          x={margin.left + tooltip.cx}
          y={margin.top + tooltip.cy}
          xKey={xKey}
          yKey={yKey}
        />
      )}
      <svg width={cWidth} height={cHeight} data-test-id="line-chart">
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
              label={yAxisLabel}
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
              label={xAxisLabel}
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
                  strokeWidth="1px"
                  d={line(lineGroup[1])}
                />
              );
            })
          ) : (
            <Line stroke={colorScale(keys[0])} d={line(data)} />
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
              label={xAxisLabel}
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
                  strokeWidth="1px"
                  d={line(lineGroup[1])}
                />
              );
            })
          ) : (
            <Line
              fill="none"
              stroke={colorScale(keys[0])}
              strokeWidth="1px"
              d={line(data)}
            />
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
            />
          )}

          {
            // If legend prop is truthy, render legend component:
            legend && (
              <ColorLegend
                legendLabel={legendLabel}
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
