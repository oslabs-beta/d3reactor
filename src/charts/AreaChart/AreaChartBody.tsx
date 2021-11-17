/** AreaChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/Axis"
import { AreaProps } from "../../../types"
import { findYDomainMax } from "../../utils"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

// const Path = styled.path`
//   fill: none;
//   stroke: black;
//   stroke-width: 2px;
// `

type AccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
type Series = d3.Series<
  {
    [key: string]: number
  },
  string
>[]
type Stack = d3.Stack<
  any,
  {
    [key: string]: number
  },
  string
>
type Area = d3.Area<any>
// interface Series {
//   key: string,
//   index: number,

// }

const Path = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 2px;
`

const AreaChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10, // TODO: replace with custom default color scheme?
}: AreaProps<number>): JSX.Element => {
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
  // offset group to match position of axes
  const translate = `translate(${margin.left}, ${margin.top})`

  const keys = ["apples", "bananas", "oranges"]
  const stack = d3.stack().keys(keys)
  const layers = stack(data)
  const yExtent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence: any) => sequence[1])),
  ]

  let xScale: ScaleFunc,
    xAccessor: AccessorFunc,
    xMin: Domain,
    xMax: Domain,
    xExtent: Domain[]
  switch (
    xDataProp.dataType // TODO: refactor to implicitly derive data type
  ) {
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xMin = d3.min(data, xAccessor)
      xMax = d3.max(data, xAccessor)
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
      break
    case "date":
      xAccessor = (d) => new Date(d[xDataProp.key])
      xMin = d3.min(data, xAccessor)
      xMax = d3.max(data, xAccessor)
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
      break
  }

  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  switch (yDataProp.dataType) {
    case "number":
      yAccessor = (d) => d
      yMin = 0
      yMax = yExtent[1]
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
    case "date":
      yAccessor = (d) => new Date(d)
      yMin = 0
      yMax = yExtent[1]
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
  }

  const areaGenerator: any = d3
    .area()
    .x((sequence: any) => xScale(xAccessor(sequence.data)))
    .y0((sequence) => yScale(sequence[0]))
    .y1((sequence) => yScale(sequence[1]))

  return (
    <g transform={translate}>
      {layers.map((layer) => (
        <path d={areaGenerator(layer)} />
      ))}
      {yAxis && (
        <Axis
          x={yAxisX}
          y={yAxisY}
          height={height}
          width={width}
          margin={margin}
          scale={yScale}
          type={yAxis}
          label={yAxisLabel}
        />
      )}
      {xAxis && (
        <Axis
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

export default AreaChartBody
