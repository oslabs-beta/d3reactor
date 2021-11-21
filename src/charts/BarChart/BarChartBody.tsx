/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import ContinuousAxis from "../../components/ContinuousAxis"
import DiscreteAxis from "../../components/DiscreteAxis"
import { transformSkinnyToWide } from "../../utils"
import { Props } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => any // number | Date | string
type Domain = any //number | Date | undefined
type ContinuousScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
type DiscreteScaleFunc = d3.ScaleBand<string>
type ColorScale = d3.ScaleOrdinal<string, string, never>

const BarChartBody = ({
  data,
  height,
  width,
  xData,
  yData,
  groupBy,
  xAxis,
  yAxis,
  yGrid,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: Props<number>): JSX.Element => {
  const margin = useMemo(
    () => getMargins(xAxis, yAxis, xAxisLabel, yAxisLabel),
    [xAxis, yAxis, xAxisLabel, yAxisLabel]
  )

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, height, margin),
    [height, xAxis, margin]
  )

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, width, margin),
    [width, yAxis, margin]
  )

  const translate = `translate(${margin.left}, ${margin.top})`

  const keys: string[] = []
  if (groupBy) {
    for (let entry of data) {
      if (!keys.includes(entry[groupBy ?? ""])) {
        keys.push(entry[groupBy ?? ""])
      }
    }
    data = transformSkinnyToWide(data, keys, groupBy, xData.key, yData.key)
  } else {
    keys.push(yData.key)
  }

  const stack = d3.stack().keys(keys).order(d3.stackOrderAscending)
  const layers = stack(data)

  const xAccessor: AccessorFunc = (d) => d[xData.key]
  const xScale: DiscreteScaleFunc = d3
    .scaleBand()
    .paddingInner(0.1)
    .paddingOuter(0.1)
    .domain(data.map(xAccessor))
    .range([0, width - margin.right - margin.left])

  const yExtent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence: any) => sequence[1])),
  ]
  const yAccessor: AccessorFunc = (d) => d[yData.key]
  const yScale: ContinuousScaleFunc = d3
    .scaleLinear()
    .domain(yExtent)
    .range([height - margin.top - margin.bottom, margin.top])

  layers.forEach((l) => {
    console.log("l ", l)
    l.forEach((sequence) => {
      console.log("yScale sequence at index 1 ", yScale(sequence[1]))
    })
  })

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <g transform={translate}>
      {layers.map((layer: any, i: number) => (
        <g key={i}>
          {layer.map((sequence: any, i: number) => (
            <rect
              key={i}
              x={xScale(xAccessor(sequence.data))}
              y={yScale(sequence[1])}
              width={xScale.bandwidth()}
              height={yScale(sequence[0]) - yScale(sequence[1])}
              style={{ fill: colorScale(layer.key) }}
            />
          ))}
        </g>
      ))}
      {yAxis && (
        <ContinuousAxis
          x={yAxisX}
          y={yAxisY}
          height={height}
          width={width}
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
          height={height}
          width={width}
          margin={margin}
          scale={xScale}
          type={xAxis}
          label={xAxisLabel}
        />
      )}
    </g>
  )
}

export default BarChartBody
