/** App.js */
import React, { useState, useMemo } from "react"
import * as d3 from "d3"
import {
  AreaChartProps,
  ColorScale,
  xAccessorFunc,
  Data,
  yAccessorFunc,
} from "../../../types"
import { Axis } from "../../components/ContinuousAxis"
import { useResponsive } from "../../hooks/useResponsive"
import { xScaleDef } from "../../functionality/xScale"
import { yScaleDef } from "../../functionality/yScale"
import { d3Voronoi } from "../../functionality/voronoi"
import ListeningRect from "../../components/ListeningRect"
import { Tooltip } from "../../components/Tooltip"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
  transformSkinnyToWide,
} from "../../utils"

export default function AreaChart({
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
}: AreaChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false)
  const chart = "AreaChart"

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
  // offset group to match position of axes
  const translate = `translate(${margin.left}, ${margin.top})`

  // type KeyType = { key: string; dataType?: "number" | "date" | undefined; }

  // if no xKey datatype is passed in, determine if it's Date
  if (!xDataType) {
    xDataType = inferXDataType(data[0], xKey)
  }

  // generate arr of keys. these are used to render discrete areas to be displayed
  const keys: string[] = []
  if (groupBy) {
    for (const entry of data) {
      const property = String(entry[groupBy ?? ""])
      if (property && !keys.includes(property)) {
        keys.push(property)
      }
    }
    data = transformSkinnyToWide(data, keys, groupBy, xKey, yKey)
  } else {
    keys.push(yKey)
  }

  // generate stack: an array of Series representing the x and associated y0 & y1 values for each area
  const stack = d3.stack().keys(keys)
  const layers = useMemo(() => {
    const layersTemp = stack(data as Iterable<{ [key: string]: number }>)
    for (const series of layersTemp) {
      series.sort((a, b) => b.data[xKey] - a.data[xKey])
    }
    return layersTemp
  }, [data, keys])

  const xAccessor: xAccessorFunc =
    xDataType === "number" ? (d) => d[xKey] : (d) => new Date(d[xKey])
  const yAccessor: yAccessorFunc = (d) => d[yKey]

  const { xScale, xMin, xMax } = xScaleDef(
    data,
    xDataType,
    xAccessor,
    margin,
    cWidth,
    chart
  )
  const yScale = yScaleDef(layers, yAccessor, margin, cHeight, chart)

  let xTicksValue = [xMin, ...xScale.ticks(), xMax]

  const areaGenerator: any = d3
    .area()
    .x((layer: any) => xScale(xAccessor(layer.data)))
    .y0((layer) => yScale(layer[0]))
    .y1((layer) => yScale(layer[1]))

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
            xGrid={xGrid}
            type={xAxis}
            label={xAxisLabel}
            xTicksValue={xTicksValue}
          />
        )}
        {layers.map((layer, i) => (
          <path key={i} d={areaGenerator(layer)} fill={colorScale(layer.key)} />
        ))}
        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}

        <ListeningRect
          data={data}
          layers={layers}
          width={cWidth}
          height={cHeight}
          margin={margin}
          xScale={xScale}
          yScale={yScale}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          setTooltip={setTooltip}
        />
      </g>
    </svg>
  )
}
