/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import { PieChartProps } from "../../../types"
import {
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => any // number | Date | string
type Domain = any //number | Date | undefined
type ContinuousScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
type DiscreteScaleFunc = d3.ScaleBand<string>

const PieChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
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

  const xAccessor: AccessorFunc = (d) => d[xDataProp.key]
  const xScale: DiscreteScaleFunc = d3
    .scaleBand()
    .paddingInner(0.1)
    .domain(data.map(xAccessor))
    .range([0, width - margin.right - margin.left])

  const yAccessor: AccessorFunc = (d) => d[yDataProp.key]
  const yMax: Domain = d3.max(data, yAccessor)
  const yScale: ContinuousScaleFunc = d3
    .scaleLinear()
    .domain([0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, margin.top])
    .nice()

  return (
    <g transform={translate}>
      {data.map((d: any, i: number) => (
        <rect
          key={i}
          x={xScale(xAccessor(d))}
          y={yScale(yAccessor(d))}
          width={xScale.bandwidth()}
          height={xAxisY - yScale(yAccessor(d))}
        />
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
