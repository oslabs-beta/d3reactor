/** App.js */
import React, { useState, useMemo } from "react"
import * as d3 from "d3"
import { useResponsive } from "../../hooks/useResponsive"
import { Axis } from "../../components/ContinuousAxis"
import { Circle } from "../../components/Circle"

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
  getMargins,
  inferXDataType,
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
  colorScheme = d3.schemeCategory10,
}: ScatterPlotProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false)
  const chart = "ScatterPlot"

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

  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>
  const groupAccessor = (d: any) => d[groupBy ?? ""]
  groups = d3.group(data, groupAccessor)
  keys = Array.from(groups).map((group) => group[0])

  const xAccessor: xAccessorFunc = useMemo(() => {return  xType === "number" ? (d) => d[xKey] : (d) => new Date(d[xKey])}, [])
  const yAccessor:yAccessorFunc = useMemo(() => { return (d) => d[yKey] }, [])

  const { xScale } = useMemo(() => {return xScaleDef(
    data,
    xType,
    xAccessor,
    margin,
    cWidth,
    chart
  )}, [data, cWidth, margin]);
  
  const yScale = useMemo(() => {return yScaleDef(data, yAccessor, margin, cHeight)}, [data, yAccessor, margin, cHeight])

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
  [data, xScale, yScale, xAccessor, yAccessor, cHeight, cWidth, margin]
  );

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
        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}
      </g>
    </svg>
  )
}
