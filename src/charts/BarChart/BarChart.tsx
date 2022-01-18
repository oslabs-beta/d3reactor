/** App.js */
import React, { useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { useResponsive } from '../../hooks/useResponsive';
import { Axis } from '../../components/ContinuousAxis';
import { DiscreteAxis } from '../../components/DiscreteAxis';
import { Rectangle } from '../../components/Rectangle';
import TooltipDiv from '../../components/TooltipDiv';
import { ColorLegend } from '../../components/ColorLegend';
import { transformSkinnyToWide } from '../../utils';
import { BarChartProps, Data, ColorScale, yAccessorFunc } from '../../../types';
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
  colorScheme = d3.quantize(d3.interpolateHcl('#9dc8e2', '#07316b'), 8),
}: BarChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false);

  const chart = 'BarChart';

  const { anchor, cHeight, cWidth } = useResponsive();

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const [tickMargin, setTickMargin] = useState(0);
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

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, cHeight, margin),
    [cHeight, xAxis, margin]
  );

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, cWidth, margin),
    [cWidth, yAxis, margin]
  );

  const translate = `translate(${margin.left}, ${margin.top})`;

  // When the yKey key has been assigned to the groupBy variable we know the user didn't specify grouping
  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>;
  const groupAccessor = (d: Data) => d[groupBy ?? ''];
  groups = d3.group(data, groupAccessor);
  keys = groupBy ? Array.from(groups).map((group) => group[0]) : [yKey];
  if (groupBy) {
    data = transformSkinnyToWide(data, keys, groupBy, xKey, yKey);
  }
  const stack = d3.stack().keys(keys).order(d3.stackOrderAscending);
  const layers = stack(data as Iterable<{ [key: string]: number }>);

  const xAccessor: (d: Data) => string = useMemo(() => {
    return (d) => d[xKey];
  }, []);

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey];
  }, []);

  const rangeMax = cWidth - margin.right - margin.left;
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(data.map(xAccessor))
      .range([0, rangeMax > 40 ? rangeMax : 40]);
  }, [data, xAccessor, cWidth, margin]);

  const yScale = useMemo(() => {
    return yScaleDef(
      groupBy ? layers : data,
      yAccessor,
      margin,
      cHeight,
      chart,
      groupBy
    );
  }, [data, yAccessor, margin, cHeight, chart, groupBy]);

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme);
  colorScale.domain(keys);

  const getSequenceData = (sequence: any) => {
    const xKeyValue = { [xKey]: sequence.data[xKey] };
    const yKeyValue = { [yKey]: sequence[1] };
    return { ...xKeyValue, ...yKeyValue };
  };

  return (
    <div ref={anchor} style={{ width: width, height: height }}>
      {tooltip && (
        <TooltipDiv
          chartType="bar-chart"
          data={tooltip}
          x={tooltip.cx + xScale.bandwidth() / 2 + margin.left}
          y={tooltip.cy + margin.top}
          xKey={xKey}
          yKey={yKey}
        />
      )}
      <svg width={cWidth} height={cHeight} data-test-id="bar-chart">
        <g transform={translate}>
          {xAxis && (
            <DiscreteAxis
              x={xAxisX}
              y={xAxisY}
              height={cHeight}
              width={cWidth}
              margin={margin}
              scale={xScale}
              type={xAxis}
              label={xAxisLabel}
              data={data}
              layers={layers}
              xAccessor={xAccessor}
              setTickMargin={setTickMargin}
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
              tickMargin={tickMargin}
            />
          )}
          {groupBy
            ? layers.map((layer: any, i: number) => (
                <g key={i}>
                  {layer.map((sequence: any, j: number) => (
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
                      fill={colorScale(layer.key)}
                      setTooltip={setTooltip}
                    />
                  ))}
                </g>
              ))
            : data.map((d: any, i: number) => (
                <Rectangle
                  data={d}
                  dataTestId={`rectangle-${i}`}
                  key={i + 'R'}
                  x={xScale(xAccessor(d))}
                  y={yScale(yAccessor(d))}
                  width={xScale.bandwidth()}
                  height={
                    xAxisY - yScale(yAccessor(d)) > 0
                      ? xAxisY - yScale(yAccessor(d))
                      : 0
                  }
                  fill={colorScale(yKey)}
                  setTooltip={setTooltip}
                />
              ))}

          {
            // If legend prop is truthy, render legend component:
            legend && (
              <ColorLegend
                legendLabel={legendLabel}
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
