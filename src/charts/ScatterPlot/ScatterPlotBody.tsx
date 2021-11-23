/** LineChart.js */
import { useMemo } from "react"
import * as d3 from "d3"
import Axis from "../../components/ContinuousAxis"
import Circle from "./Circle"
import { ScatterProps } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
interface DataArg {
  [key: string]: number | string
}
type ColorScale = d3.ScaleOrdinal<string, string, never>

const ScatterPlotBody = ({
  data,
  height = 0,
  width = 0,
  xData,
  yData,
  groupBy,
  xAxis,
  yAxis,
  xGrid,
  yGrid,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: ScatterProps<number>): JSX.Element => {
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

  let keys: string[] = [],
    groups: d3.InternMap<any, any[]>
  const groupAccessor = (d: any) => d[groupBy ?? ""]
  groups = d3.group(data, groupAccessor)
  keys = Array.from(groups).map((group) => group[0])

  let xScale: ScaleFunc, xAccessor: AccessorFunc, xMin: Domain, xMax: Domain
  switch (xData.dataType) {
    case "number":
      xAccessor = (d) => d[xData.key]
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()

        
      break
    case "date":
      xAccessor = (d) => new Date(d[xData.key])
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()

        
      break
  }

  let xTicksValue = [xMin, ... xScale.ticks(), xMax]


  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  switch (yData.dataType) {
    case "number":
      yAccessor = (d) => d[yData.key]
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()

        
      break
    case "date":
      yAccessor = (d) => new Date(d[yData.key])
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
        
      break
  }

  let yTicksValue = [yMin, ... yScale.ticks(), yMax]


  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  )
  let voronoi: d3.Voronoi<string> = null as unknown as d3.Voronoi<string>
  if (height && width) {
    voronoi = delaunay.voronoi([
      0,
      0,
      width - margin.right - margin.left,
      height - margin.bottom - margin.top,
    ])
  }

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  return (
    <g className="spbody" transform={translate}>
      {yAxis && (
        <Axis
          x={yAxisX}
          y={yAxisY}
          yGrid={yGrid}
          height={height}
          width={width}
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
          height={height}
          width={width}
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
        <g className="voronoi-wrapper">
          {data.map((elem: DataArg, i: number) => (
            <path key={i} fill='none' opacity={0.5} d={voronoi.renderCell(i)}></path>
          ))}
        </g>
      )}
    </g>
  )
}

export default ScatterPlotBody
