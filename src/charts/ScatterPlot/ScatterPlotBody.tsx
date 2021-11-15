/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import Axis from "../../components/Axis"
import Circle from "./Circle"
import { Props } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

const ScatterChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
  xGrid,
  yGrid,
  xAxisLabel,
  yAxisLabel,
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

  let xScale: ScaleFunc, xAccessor: AccessorFunc, xMin: Domain, xMax: Domain
  switch (xDataProp.dataType) {
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
    case "date":
      xAccessor = (d) => new Date(d[xDataProp.key])
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
  }

  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  switch (yDataProp.dataType) {
    case "number":
      yAccessor = (d) => d[yDataProp.key]
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      console.log("Min and max ", yMin, yMax)
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
    case "date":
      yAccessor = (d) => new Date(d[yDataProp.key])
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
  }

  return (
    <g className="spbody" transform={translate}>
      {yAxis && (
        <Axis
          x={yAxisX}
          y={yAxisY}
          yGrid={yGrid}
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
          xGrid={xGrid}
          height={height}
          width={width}
          margin={margin}
          scale={xScale}
          type={xAxis}
          label={xAxisLabel}
        />
      )}
      {data.map((element: { [key: string]: number }, i: number) => (
        <Circle
          key={i}
          cx={xScale(xAccessor(element))}
          cy={yScale(yAccessor(element))}
          r={5}
          color="steelblue"
        />
      ))}
    </g>
  )
}

export default ScatterChartBody
