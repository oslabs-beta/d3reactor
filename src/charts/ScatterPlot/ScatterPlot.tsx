/** App.js */
import React, { useState, useMemo } from "react"
import * as d3 from "d3"
import { useResponsive } from "../../hooks/useResponsive"
import { Axis } from "../../components/ContinuousAxis"
import { Circle } from "../../components/Circle"
import { ColorLegend } from "../../components/ColorLegend"

import { d3Voronoi } from "../../functionality/voronoi"
import { xScaleDef } from "../../functionality/xScale"
import { yScaleDef } from "../../functionality/yScale"
import { VoronoiWrapper } from "../../components/VoronoiWrapper"
import { Tooltip } from "../../components/Tooltip"
import {
  ScatterPlotProps,
  xAccessorFunc,
  yAccessorFunc,
  ColorScale,
} from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMarginsWithLegend,
  inferXDataType,
  EXTRA_LEGEND_MARGIN
} from "../../utils"

export default function ScatterPlot({
  data,
  height = "100%",
  width = "100%",
  xKey,
  xDataType,
  yKey,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  legend,
  legendLabel,
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
}: ScatterPlotProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false)
  const chart = "ScatterPlot"

  const { anchor, cHeight, cWidth } = useResponsive()

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const xOffset = legendOffset[0];
  const yOffset = legendOffset[1];
  const margin = useMemo(
    () => getMarginsWithLegend(
      xAxis, yAxis, xAxisLabel, yAxisLabel, 
      legend, xOffset, yOffset, cWidth, cHeight
      ),
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

  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>
  const groupAccessor = (d: any) => d[groupBy ?? ""]
  groups = d3.group(data, groupAccessor)
  keys = groupBy ? Array.from(groups).map((group) => group[0]) : [yKey];

  const xAccessor: xAccessorFunc = useMemo(() => {
    return xType === "number" ? (d) => d[xKey] : (d) => new Date(d[xKey])
  }, [])
  const yAccessor: yAccessorFunc = useMemo(() => {
    return (d) => d[yKey]
  }, [])

  const { xScale } = useMemo(() => {
    return xScaleDef(data, xType, xAccessor, margin, cWidth, chart)
  }, [data, cWidth, margin])

  const yScale = useMemo(() => {
    return yScaleDef(data, yAccessor, margin, cHeight)
  }, [data, yAccessor, margin, cHeight])

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
      <g className="spbody" transform={translate}>
        {yAxis && (
          <Axis
            x={yAxisX}
            y={yAxisY}
            yGrid={yGrid}
            height={cHeight}
            width={cWidth}
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
            height={cHeight}
            width={cWidth}
            margin={margin}
            scale={xScale}
            type={xAxis}
            label={xAxisLabel}
          />
        )}
        {data.map((element: any, i: number) =>
          !groupBy ? (
            <Circle
              key={i}
              cx={xScale(xAccessor(element))}
              cy={yScale(yAccessor(element))}
              r={5}
              color="steelblue"
            />
          ) : (
            <Circle
              key={i}
              cx={xScale(xAccessor(element))}
              cy={yScale(yAccessor(element))}
              r={5}
              color={colorScale(element[groupBy])}
            />
          )
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
          legendLabel={legendLabel } 
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
