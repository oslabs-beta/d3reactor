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
  getMarginsWithLegend,
  inferXDataType,
  EXTRA_LEGEND_MARGIN
} from "../../utils"
import { ColorLegend } from "../../components/ColorLegend"
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
  legend,
  legendLabel = groupBy,
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
}: LineChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false)
  const chart = "LineChart"

  let { anchor, cHeight, cWidth } = useResponsive()


  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const xOffset = legendOffset[0];
  const yOffset = legendOffset[1];
  const EXTRA_LEGEND_MARGIN = 6;
  const margin = useMemo(
    () => getMarginsWithLegend(
      xAxis, yAxis, xAxisLabel, yAxisLabel, 
      legend, xOffset, yOffset, cWidth, cHeight),
    [xAxis, yAxis, xAxisLabel, yAxisLabel, legend, xOffset, yOffset, cWidth, cHeight]
  );

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, cHeight, margin),
    [cHeight, xAxis, margin]
  )

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, cWidth, margin),
    [cWidth, yAxis, margin]
  )

  const translate = `translate(${margin.left}, ${margin.top})`

  let xType: "number" | "date" = inferXDataType(data[0], xKey)
  if (xDataType !== undefined) xType = xDataType
  // if no xKey datatype is passed in, determine if it's Date

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === "number" ? (d) => d[xKey] : (d) => new Date(d[xKey])
  }, [])

  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey]
  }, [])

  const yScale = useMemo(() => {
    return yScaleDef(data, yAccessor, margin, cHeight)
  }, [data, yAccessor, margin, cHeight])

  const { xScale, xMin, xMax } = useMemo(() => {
    return xScaleDef(data, xType, xAccessor, margin, cWidth, chart)
  }, [data, cWidth, margin])

  let xTicksValue = [xMin, ...xScale.ticks(), xMax]

  let keys: Iterable<string> = []
  const groupAccessor: GroupAccessorFunc = (d) => {
    return d[groupBy ?? ""]
  }
  const lineGroups: any = d3.group(data, (d) => groupAccessor(d))
  keys = groupBy ? Array.from(lineGroups).map((group: any) => group[0]) : [yKey];
  const line: any = d3
    .line()
    .curve(d3.curveLinear)
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))

  const voronoi = useMemo(() => {
    return d3Voronoi(
      data,
      xScale,
      yScale,
      xAccessor,
      yAccessor,
      cHeight,
      cWidth,
      margin
    )
  }, [data, xScale, yScale, xAccessor, yAccessor, cHeight, cWidth, margin])

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

        { // If legend prop is truthy, render legend component:
        legend && <ColorLegend 
          legendLabel={legendLabel} 
          circleRadius={5 /* Radius of each color swab in legend */}
          colorScale={colorScale}
          setLegendOffset={setLegendOffset}
          legendPosition={legend}
          xOffset={xOffset}
          yOffset={yOffset}
          margin={margin}
          cWidth={cWidth}
          cHeight={cHeight}
          EXTRA_LEGEND_MARGIN={EXTRA_LEGEND_MARGIN}
        />}

        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}

      </g>
    </svg>
  )
}
