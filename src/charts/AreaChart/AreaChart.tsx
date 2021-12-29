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
import { ColorLegend } from "../../components/ColorLegend";
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  getMarginsWithLegend,
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
  legend = 'right',
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
}: AreaChartProps<string | number>): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false);
  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const chart = "AreaChart";
  const { anchor, cHeight, cWidth } = useResponsive();

  const xOffset = legendOffset[0];
  const yOffset = legendOffset[1];
  const margin = useMemo(
    () => getMarginsWithLegend(xAxis, yAxis, xAxisLabel, yAxisLabel, 
                              legend, xOffset, yOffset, cWidth, cHeight),
    [xAxis, yAxis, xAxisLabel, yAxisLabel, legend, xOffset, yOffset, cWidth, cHeight]
  )
  console.log('%%%%%%%%%%legendOffset ', legendOffset)
  console.log('%%%%%%%%%%margin ', margin)

  // determine legend placement:
  let xPosition: number = 0, 
      yPosition: number = cHeight/2 - legendOffset[1]/2;
  switch(legend) {
    case 'left': 
      xPosition -= margin.left;
      break;
    case 'top-left': 
      xPosition -= margin.left;
      yPosition = margin.top;
      break;
    case 'bottom-left': 
      xPosition -= margin.left;
      yPosition = cHeight - yOffset / 2 - margin.bottom;
      break;
    case 'top':
      xPosition = (cWidth - margin.left) / 2 - legendOffset[0] / 2;
      yPosition = yOffset / 2 - margin.top;
      break;
    case 'bottom':
      xPosition = (cWidth - margin.left) / 2 - legendOffset[0] / 2
      yPosition = cHeight - yOffset;
      break;
    case 'top-right':
      xPosition += cWidth - margin.left - margin.right + 20;
      yPosition = margin.top;
      break;
    case 'bottom-right':
      xPosition += cWidth - margin.left - margin.right + 20;
      yPosition = cHeight - yOffset/2 - margin.bottom;
      break;
    case 'right':
    default:
      xPosition += cWidth - margin.left - margin.right + 20;
  }

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

        { // If legend prop is truthy, render legend component:
        legend && <ColorLegend 
          colorLegendLabel={'Fruit' /**we need a way to derive this either from data or as an extra prop passed in */} 
          xPosition={xPosition /* Where legend is placed on page */}
          yPosition={yPosition/* Where legend is placed on page */}
          circleRadius={5 /* Radius of each color swab in legend */}
          // tickSpacing={22 /* Vertical space between each line of legend */}
          // tickTextOffset={12 /* How much the text label is pushed to the right of the color swab */}
          colorScale={colorScale}
          setLegendOffset={setLegendOffset}
        />}
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
  );
}
