/** LineChart.js */
import React, { useMemo } from "react";
import * as d3 from "d3";
import Axis from "../../components/ContinuousAxis";
import { LineProps, ColorScale } from "../../../types";
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
} from "../../utils";

type AccessorFunc = (d: any) => number | Date
type GroupAccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

const LineChartBody = ({
  data,
  height = 0,
  width = 0,
  xKey,
  xDataType,
  yKey,
  groupBy,
  xAxis,
  xGrid,
  yGrid,
  yAxis,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
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


  // if no xKey datatype is passed in, determine if it's Date
  if (!xDataType) {
    xDataType = inferXDataType(data[0], xKey);
  }


  let xScale: ScaleFunc, xAccessor: AccessorFunc, xMin: Domain, xMax: Domain
  switch (xDataType) {
    case "number":
      xAccessor = (d) => d[xKey]
      xMin = d3.min(data, xAccessor)
      xMax = d3.max(data, xAccessor)
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
      break
    case "date":
      xAccessor = (d) => new Date(d[xKey])
      xMin = d3.min(data, xAccessor)
      xMax = d3.max(data, xAccessor)
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
      break
  }

  let xTicksValue = [xMin, ... xScale.ticks(), xMax]

  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  yAccessor = (d: any) => d[yKey]
  yMin = d3.min(data, yAccessor)
  yMax = d3.max(data, yAccessor)
  yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()

  const groupAccessor: GroupAccessorFunc = (d) => {
    return d[groupBy ?? ""]
  }
  const lineGroups: any = d3.group(data, (d) => groupAccessor(d))

  const line: any = d3
    .line()
    .curve(d3.curveLinear)
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))

  let keys: Iterable<string> = []
  keys = Array.from(lineGroups).map((group: any) => group[0])
  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <g transform={translate}>
      {yAxis && (
        <Axis
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
        <Axis
        x={xAxisX}
        y={xAxisY}
        height={height}
        width={width}
        margin={margin}
        scale={xScale}
        type={xAxis}
        xGrid={xGrid}
        label={xAxisLabel}
        xTicksValue={xTicksValue}
        />
        )}
        {groupBy ? (
          d3.map(lineGroups, (lineGroup: [string, []], i) => {
            return (
              <path
                key={i}
                className="line"
                fill="none"
                stroke={colorScale(lineGroup[0])}
                strokeWidth="1px"
                d={line(lineGroup[1])}
              />
            )
          })
        ) : (
          <path
            className="line"
            fill="none"
            stroke={colorScale(yKey)}
            strokeWidth="1px"
            d={line(data)}
          />
        )}
    </g>
  )
}

export default LineChartBody
