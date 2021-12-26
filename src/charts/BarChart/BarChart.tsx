/** App.js */
import React, { useMemo } from "react";
import * as d3 from "d3";
import { useResponsive } from "../../hooks/useResponsive"
import {Axis} from "../../components/ContinuousAxis";
import DiscreteAxis from "../../components/DiscreteAxis";
import { transformSkinnyToWide } from "../../utils";
import { BarChartProps, Data, ColorScale, yAccessorFunc } from "../../../types";
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
} from "../../utils"

export default function BarChart({
  data,
  height = "100%",
  width = "100%",
  xKey,
  yKey,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: BarChartProps<string | number>): JSX.Element {
  const chart = 'BarChart';
  const { anchor, cHeight, cWidth } = useResponsive();

  const margin = useMemo(
    () => getMargins(xAxis, yAxis, xAxisLabel, yAxisLabel),
    [xAxis, yAxis, xAxisLabel, yAxisLabel]
  )

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, cHeight, margin),
    [cHeight, xAxis, margin]
  )

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, cWidth, margin),
    [cWidth, yAxis, margin]
  )

  const translate = `translate(${margin.left}, ${margin.top})`

  // When the yKey key has been assigned to the groupBy variable we know the user didn't specify grouping
  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>
  const groupAccessor = (d: Data) => d[groupBy ?? ""]
  groups = d3.group(data, groupAccessor)
  keys = Array.from(groups).map((group) => group[0])
  if (groupBy) {
    data = transformSkinnyToWide(data, keys, groupBy, xKey, yKey)
  }
  const stack = d3.stack().keys(keys).order(d3.stackOrderAscending)
  const layers = stack(data as Iterable<{ [key: string]: number; }>)

  const xAccessor: (d: Data) => string = useMemo(() => {return (d) => d[xKey]}, [])
  
  const yAccessor:yAccessorFunc = useMemo(() => { return (d) => d[yKey] }, [])

  const [yMin, yMax] = !groupBy ? [0, d3.max(data, yAccessor)]
    : [0,
    d3.max(layers, (layer: any) => d3.max(layer, (sequence: [number, number, any]) => sequence[1]))
  ]

  const xScale: d3.ScaleBand<string> = d3
    .scaleBand()
    .paddingInner(0.1)
    .paddingOuter(0.1)
    .domain(data.map(xAccessor))
    .range([0, cWidth - margin.right - margin.left])

    const yScale: d3.ScaleLinear<number, number, never> = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([cHeight - margin.top - margin.bottom, 0])
    .nice()

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <svg ref={anchor} width={width} height={height}>
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
        />
        )}
        {groupBy
          ? layers.map((layer: any, i: number) => (
              <g key={i}>
                {layer.map((sequence: any, i: number) => (
                  <rect
                    key={i}
                    x={xScale(xAccessor(sequence.data))}
                    y={yScale(sequence[1])}
                    width={xScale.bandwidth()}
                    height={yScale(sequence[0]) - yScale(sequence[1]) > 0 ? yScale(sequence[0]) - yScale(sequence[1]) : 0}
                    style={{ fill: colorScale(layer.key) }}
                  />
                ))}
              </g>
            ))
          : data.map((d: any, i: number) => (
              <rect
                key={i}
                x={xScale(xAccessor(d))}
                y={yScale(yAccessor(d))}
                width={xScale.bandwidth()}
                height={xAxisY - yScale(yAccessor(d)) > 0 ? xAxisY - yScale(yAccessor(d)) : 0}
                style={{ fill: colorScale(yKey) }}
  
              />
            ))}
    </g>
    </svg>
  )
}
