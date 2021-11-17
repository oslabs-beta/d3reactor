/** LineChart.js */
import React, { useMemo, useEffect } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/ContinuousAxis"
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
interface DataArg {
  [key: string]: number | string
}

const Path = styled.path`
  fill: none;
  stroke: #ff1493;
  opacity: 0.5;
`

const ScatterPlotBody = ({
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

  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  )
  let voronoi: d3.Voronoi<string> = null as unknown as d3.Voronoi<string>
  if (height && width) {
    voronoi = delaunay.voronoi([
      0,
      0,
      width - margin.right - margin.left,
      height - margin.bottom - margin.top,
    ])
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
      {data.map((element: DataArg, i: number) => (
        <Circle
          key={i}
          cx={xScale(xAccessor(element))}
          cy={yScale(yAccessor(element))}
          r={5}
          color="steelblue"
        />
      ))}
      {voronoi && (
        <g className="voronoi-wrapper">
          {data.map((elem: DataArg, i: number) => (
            <Path d={voronoi.renderCell(i)}></Path>
          ))}
        </g>
      )}
    </g>
  )
}

export default ScatterPlotBody
