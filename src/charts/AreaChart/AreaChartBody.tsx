/** AreaChart.js */
import { useMemo } from "react"
import * as d3 from "d3"
import ContinuousAxis from "../../components/ContinuousAxis"
import { AreaProps, ColorScale } from "../../../types"
import { transformSkinnyToWide } from "../../utils"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
} from "../../utils"
import { isAssertClause } from "typescript"

type AccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

type Series = d3.Series<
  {
    [key: string]: number
  },
  string
>[]

type Stack = d3.Stack<
  any,
  {
    [key: string]: number
  },
  string
>

type Area = d3.Area<any>

const AreaChartBody = ({
  data,
  height = 0,
  width = 0,
  xKey,
  xDataType,
  yKey,
  groupBy,
  xAxis,
  yAxis,
  xGrid,
  yGrid,
  xAxisLabel,
  yAxisLabel,
  colorScheme, // TODO: replace with custom default color scheme?
}: AreaProps<number>): JSX.Element => {
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
  // offset group to match position of axes
  const translate = `translate(${margin.left}, ${margin.top})`
  
  // type KeyType = { key: string; dataType?: "number" | "date" | undefined; }
  
  // if no xKey datatype is passed in, determine if it's Date
  if (!xDataType) {
    xDataType = inferXDataType(data[0], xKey);
  }

  // generate arr of keys. these are used to render discrete areas to be displayed
  const keys: string[] = [];
  if (groupBy) {
    for (const entry of data) {
      const property = String(entry[groupBy ?? ""]);
      if (property && !keys.includes(property)) {
        keys.push(property)
      }
    }
    data = transformSkinnyToWide(data, keys, groupBy, xKey, yKey);
  } else {
    keys.push(yKey)
  }

  // generate stack: an array of Series representing the x and associated y0 & y1 values for each area
  const stack = d3.stack().keys(keys)
  const layers = useMemo(() => {
    const layersTemp = stack(data as Iterable<{ [key: string]: number; }>);
    for (const series of layersTemp) {
      series.sort((a, b) => b.data[xKey] - a.data[xKey]);
    }
    return layersTemp;
  }, [data, keys])

  let xScale: ScaleFunc, xAccessor: AccessorFunc, xMin: Domain, xMax: Domain
  switch (xDataType as "date" | "number") { 
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

  //let xTicksValue = [xMin, ... xScale.ticks(), xMax]


  const yExtent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence: any) => sequence[1])),
  ]
  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  yAccessor = (d) => d
  yMin = 0
  yMax = yExtent[1]
  yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()

  let yTicksValue = [yMin, ... yScale.ticks(), yMax]

  const areaGenerator: any = d3
    .area()
    .x((layer: any) => xScale(xAccessor(layer.data)))
    .y0((layer) => yScale(layer[0]))
    .y1((layer) => yScale(layer[1]))

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <g transform={translate}>
      {layers.map((layer, i) => (
        <path
          key={i}
          d={areaGenerator(layer)}
          style={{ fill: colorScale(layer.key) }}
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
        <ContinuousAxis
          x={xAxisX}
          y={xAxisY}
          height={height}
          width={width}
          margin={margin}
          scale={xScale}
          xGrid={xGrid}
          type={xAxis}
          label={xAxisLabel}
        />
      )}
    </g>
  )
}

export default AreaChartBody
