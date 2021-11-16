/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/Axis"
import { Props } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => any // number | Date | string
type Domain = any //number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
  | d3.ScaleBand<string>

const BarChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
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

  const xAccessor: AccessorFunc = (d) => d[xDataProp.key]
  // const xMin: Domain = d3.extent(data, xAccessor)[0]
  // const xMax: Domain = d3.extent(data, xAccessor)[1]
  const xScale: ScaleFunc = d3
    .scaleBand()
    .paddingInner(0.1)
    .domain(data.map(xAccessor))
    .range([0, width - margin.right - margin.left])

  const yAccessor: AccessorFunc = (d) => d[yDataProp.key]
  // const yMin: Domain = d3.extent(data, yAccessor)[0]
  const yMax: Domain = d3.max(data, yAccessor)
  const yScale: ScaleFunc = d3
    .scaleLinear()
    .domain([0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()

  // {
  //   data.map((d: any) => {
  //     ;<rect
  //       x={xScale(xAccessor(d))}
  //       y={height - margin.top - margin.bottom}
  //       height={yScale(yAccessor(d))}
  //       width={xScale.bandwidth()}
  //     />
  //   })
  // }

  return (
    <g transform={translate}>
      {data.map((d: any) => (
        <rect
          x={xScale(xAccessor(d))}
          y={height - margin.top - margin.bottom - yScale(yAccessor(d))}
          width={xScale.bandwidth()}
          height={yScale(yAccessor(d))}
        />
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
      {/* {xAxis && (
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
      )} */}
    </g>
  )
}

export default BarChartBody
