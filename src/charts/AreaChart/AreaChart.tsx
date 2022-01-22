/** App.js */
import React, { useState, useMemo } from 'react';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as d3 from 'd3';
import {
  Data,
  AreaChartProps,
  xAccessorFunc,
  yAccessorFunc,
} from '../../../types';
import { Axis } from '../../components/ContinuousAxis';
import { Label } from '../../components/Label';
import { useResponsive } from '../../hooks/useResponsive';
import { xScaleDef } from '../../functionality/xScale';
import { yScaleDef } from '../../functionality/yScale';
import ListeningRect from '../../components/ListeningRect';
import TooltipDiv from '../../components/TooltipDiv';
import { ColorLegend } from '../../components/ColorLegend';
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  inferXDataType,
  transformSkinnyToWide,
  EXTRA_LEGEND_MARGIN,
} from '../../utils';

import { useMousePosition } from '../../hooks/useMousePosition';

export default function AreaChart({
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
  colorScheme = 'schemePurples',
}: AreaChartProps<string | number>): JSX.Element {
  const position = useMousePosition();
  const [tooltip, setTooltip] = useState<false | any>(false);
  const chart = 'AreaChart';
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
  // offset group to match position of axes
  const translate = `translate(${margin.left}, ${margin.top})`;

  // if no xKey datatype is passed in, determine if it's Date
  if (!xDataType) {
    xDataType = inferXDataType(data[0], xKey);
  }
  // generate arr of keys. these are used to render discrete areas to be displayed

  const keys = useMemo(() => {
    let groups: d3.InternMap<any, any[]>;
    const groupAccessor = (d: Data) => d[groupBy ?? ''];
    groups = d3.group(data, groupAccessor);
    return groupBy ? Array.from(groups).map((group) => group[0]) : [yKey];
  }, [groupBy, yKey]);

  const transData = useMemo(() => {
    return groupBy
      ? transformSkinnyToWide(data, keys, groupBy, xKey, yKey)
      : data;
  }, [data, keys, groupBy, xKey, yKey]);

  // generate stack: an array of Series representing the x and associated y0 & y1 values for each area
  const stack = d3.stack().keys(keys);
  const layers = useMemo(() => {
    const layersTemp = stack(transData as Iterable<{ [key: string]: number }>);
    for (const series of layersTemp) {
      series.sort((a, b) => b.data[xKey] - a.data[xKey]);
    }
    return layersTemp;
  }, [transData, keys]);

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xDataType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
  }, [xKey]);

  const { xScale, xMin, xMax } = useMemo(() => {
    return xScaleDef(
      transData,
      xDataType as 'number' | 'date',
      xAccessor,
      margin,
      cWidth,
      chart
    );
  }, [transData, xDataType, xAccessor, margin, cWidth, chart]);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, [yKey]);
 
  const yScale = useMemo(() => {
    return yScaleDef(
      groupBy ? layers : transData,
      yAccessor,
      margin,
      cHeight,
      groupBy
    );
  }, [layers, transData, yAccessor, margin, cHeight, groupBy]);

  const xTicksValue = [xMin, ...xScale.ticks(), xMax];

  const areaGenerator: any = d3
    .area()
    .x((layer: any) => xScale(xAccessor(layer.data)))
    .y0((layer) => yScale(layer[0]))
    .y1((layer) => yScale(layer[1]));

  const discreteColors =
    Array.from(keys).length < 4 ? 3 : Math.min(Array.from(keys).length, 9);
  const computedScheme = d3[`${colorScheme}`][discreteColors];
  const colorScale = d3.scaleOrdinal(Array.from(computedScheme).reverse());
  colorScale.domain(keys);

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
      <svg width={cWidth} height={cHeight}>
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
              xGrid={xGrid}
              type={xAxis}
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
          {layers.map((layer, i) => (
            <path
              className="area"
              key={i}
              d={areaGenerator(layer)}
              fill={colorScale(layer.key)}
            />
          ))}
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
          <ListeningRect
            data={transData}
            layers={layers}
            width={cWidth}
            height={cHeight}
            margin={margin}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
            xKey={xKey}
            yKey={yKey}
            setTooltip={setTooltip}
          />
        </g>
      </svg>
    </div>
  );
}
