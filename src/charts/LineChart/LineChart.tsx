/** App.js */
import React, { useState, useMemo, useCallback } from "react"
import { useResponsive } from "../../hooks/useResponsive"
import * as d3 from "d3"
import { Axis } from "../../components/ContinuousAxis"
import { Line } from "../../components/Line"
import { VoronoiWrapper } from "../../components/VoronoiWrapper"
import {
  LineChartProps,
  ColorScale,
  xAccessorFunc,
  yAccessorFunc,
  GroupAccessorFunc,
} from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
} from "../../utils"
import { Tooltip } from "../../components/Tooltip"
import { yScaleDef } from "../../functionality/yScale"
import { xScaleDef } from "../../functionality/xScale"
import { d3Voronoi } from "../../functionality/voronoi"

export default function LineChart({
  data,
  height = "100%",
  width = "100%",
  xKey,
  yKey,
  xDataType,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: LineChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false)
  const chart = "LineChart"

  const { anchor, cHeight, cWidth } = useResponsive()

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
  
  let xType: 'number' | 'date' = inferXDataType(data[0], xKey)
  if(xDataType !== undefined) xType= xDataType;
  // if no xKey datatype is passed in, determine if it's Date


  const xAccessor: xAccessorFunc = useMemo(() => {return  xType === "number" ? (d) => d[xKey] : (d) => new Date(d[xKey])}, [])

  const yAccessor:yAccessorFunc = useMemo(() => { return (d) => d[yKey] }, [])

  const yScale = useMemo(() => {return yScaleDef(data, yAccessor, margin, cHeight)}, [data, margin, cHeight])

  const { xScale, xMin, xMax } = useMemo(() => {return xScaleDef(
    data,
    xType,
    xAccessor,
    margin,
    cWidth,
    chart
  )}, [data, cWidth, margin])

  let xTicksValue = [xMin, ...xScale.ticks(), xMax]

  let keys: Iterable<string> = []
  const groupAccessor: GroupAccessorFunc = (d) => {
    return d[groupBy ?? ""]
  }
  const lineGroups: any = d3.group(data, (d) => groupAccessor(d))
  keys = Array.from(lineGroups).map((group: any) => group[0])
  const line: any = d3
    .line()
    .curve(d3.curveLinear)
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))

  const voronoi = useMemo (() => {return d3Voronoi(
    data,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    cHeight,
    cWidth,
    margin
  )}, 
  [data, cHeight, cWidth]
  )

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
          <Axis
            x={xAxisX}
            y={xAxisY}
            height={cHeight}
            width={cWidth}
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
              <Line
                key={i}
                fill="none"
                stroke={colorScale(lineGroup[0])}
                strokeWidth="1px"
                d={line(lineGroup[1])}
              />
            )
          })
        ) : (
          <Line
            fill="none"
            stroke={colorScale(yKey)}
            strokeWidth="1px"
            d={line(data)}
          />
        )}
        {voronoi && (
         <VoronoiWrapper
           data={data}
           voronoi={voronoi}
           xScale={xScale}
           yScale={yScale}
           xAccessor={xAccessor}
           yAccessor={yAccessor}
           setTooltip={setTooltip}
         />
        )}

        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}
      </g>
    </svg>
  )
}
