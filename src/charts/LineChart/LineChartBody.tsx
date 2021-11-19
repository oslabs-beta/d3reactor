/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/ContinuousAxis"
import { LineProps } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

const Path = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 2px;
`

type AccessorFunc = (d: any) => number | Date
type AccessorFuncI = (d: any, i: number) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

const LineChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
  xAxisLabel,
  yAxisLabel,
}: LineProps<number>): JSX.Element => {
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

  let xScale: ScaleFunc, xAccessor: AccessorFunc, xMin: Domain, xMax: Domain
  switch (xDataProp.dataType) {
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xMin = d3.min(data, xAccessor)
      xMax = d3.max(data, xAccessor) // no need to repeat calc
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

  let yScale: ScaleFunc, yAccessor: AccessorFuncI, yMin: Domain, yMax: Domain
  switch (yDataProp.dataType) {
    case "number":
      yAccessor = (d: any, i: number) => d[yDataProp.keys[i]]
      yMin = d3.min(data, yAccessor)
      yMax = d3.max(data, yAccessor)
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
    case "date":
      yAccessor = (d: any, i: number) => new Date(d[yDataProp.keys[i]])
      yMin = d3.min(data, yAccessor)
      yMax = d3.max(data, yAccessor)
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
  }

  const line: any = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d, i) => yScale(yAccessor(d, i)))

  return (
    <g transform={translate}>
      {/* {yDataProp.keys.map((key: string, i: number) => ( */}
      <Path className="line" d={line(data)} />
      {/* ))} */}
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

export default LineChartBody
