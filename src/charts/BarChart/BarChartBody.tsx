/** LineChart.js */
import { useMemo } from "react"
import * as d3 from "d3"
import ContinuousAxis from "../../components/ContinuousAxis"
import DiscreteAxis from "../../components/DiscreteAxis"
import { transformSkinnyToWide } from "../../utils"
import { BarProps, ColorScale } from "../../../types"
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

const BarChartBody = ({
  data,
  height = 0,
  width = 0,
  xData,
  yData,
  groupBy,
  xAxis,
  yAxis,
  yGrid,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: BarProps<number>): JSX.Element => {
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

  if (!groupBy) groupBy = yData.key
  // When the yData key has been assigned to the groupBy variable we know the user didn't specify grouping
  const isNotGrouped: boolean = groupBy === yData.key
  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>
  const groupAccessor = (d: any) => d[groupBy ?? ""]
  groups = d3.group(data, groupAccessor)
  keys = Array.from(groups).map((group) => group[0])
  if (groupBy !== yData.key) {
    data = transformSkinnyToWide(data, keys, groupBy, xData.key, yData.key)
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

  let yExtent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence: any) => sequence[1])),
  ]
  const yAccessor: AccessorFunc = (d) => d[yData.key]
  if (isNotGrouped) yExtent = [0, d3.max(data, yAccessor)]

  const yScale: ContinuousScaleFunc = d3
    .scaleLinear()
    .domain(yExtent)
    .range([height - margin.top - margin.bottom, margin.top])

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <g transform={translate}>
      {!isNotGrouped
        ? layers.map((layer: any, i: number) => (
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
          ))
        : data.map((d: any, i: number) => (
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
