import * as d3 from "d3"
import React from "react"
export interface Data {
  [key: string]: any
}

export interface ScatterPlotProps<T> {
  data: Data[]
  height?: T
  width?: T
  xKey: string
  xDataType?: "date" | "number"
  yKey: string
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
  legend?: LegendPos
  legendLabel?: string
}

export interface BarChartProps<T> {
  data: Data[]
  height?: T
  width?: T
  xKey: string
  yKey: string
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
  legend?: LegendPos
  legendLabel?: string
}

export interface LineChartProps<T> {
  data: Data[]
  height?: T
  width?: T
  xKey: string
  xDataType?: "date" | "number"
  yKey: string
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
  legend?: LegendPos
  legendLabel?: string
}

export interface AreaChartProps<T> {
  data: Data[]
  height?: T
  width?: T
  xKey: string
  xDataType?: "date" | "number"
  yKey: string
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
  legend?: LegendPos
  legendLabel?: string
}

export interface PieChartProps {
  data: any
  value: string
  label: string
  innerRadius?: number | string | undefined
  outerRadius?: number | string | undefined
  colorScheme?: string[] | readonly string[]
  legend?: LegendPos
  legendLabel?: string
}

export interface PieChartBodyProps {
  data: any
  height: number
  width: number
  innerRadius: number
  outerRadius: number
  value: string
  label: string
  colorScheme?: string[] | readonly string[]
  legend?: boolean
}

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ContinuousAxisProps {
  x: number
  y: number
  xGrid?: boolean
  yGrid?: boolean
  scale:
    | d3.ScaleLinear<number, number, never>
    | d3.ScaleTime<number, number, never>
  type: "top" | "right" | "bottom" | "left"
  label: string | undefined
  height: number
  width: number
  margin: Margin
  xTicksValue?: any
}

export interface DiscreteAxisProps {
  x: number
  y: number
  xGrid?: boolean
  yGrid?: boolean
  scale: d3.ScaleBand<string>
  type: "top" | "right" | "bottom" | "left"
  label: string | undefined
  height: number
  width: number
  margin: Margin
  data: Data[]
  layers: any
  xAccessor: (d: Data) => string 
}

export interface CircleProps {
  cx: number
  cy: number
  r?: number
  color: string
}

export interface RectangleProps {
  x: number | undefined
  y: number
  width: number
  height: number
  fill: string
  setTooltip?: React.Dispatch<any>
}

export interface LineProps {
  fill: string
  stroke: string
  strokeWidth: string
  d: string | undefined
  id?: string | number
}

export interface ArcProps {
  fill: string
  stroke: string
  strokeWidth: string
  d: string | undefined
  id?: string | number
  setTooltip?: React.Dispatch<any>
}

export interface VoronoiProps {
  fill: string
  stroke: string
  opacity: number
  d: string | undefined
  cellCenter?: { cx: number; cy: number }
  data?: any
  setTooltip?: React.Dispatch<any>
}

export type ColorScale = d3.ScaleOrdinal<string, string, never>

export interface ColorLegendProps {
  colorScale: ColorScale
  tickSpacing?: number
  circleRadius: number
  tickTextOffset?: number
  legendLabel?: string
  legendPosition: LegendPos
  legendWidth: number
  legendHeight: number
  xPosition?: number
  yPosition?: number
  setLegendOffset: React.Dispatch<any>
  margin: Margin
  xAxisPosition?: "top" | "bottom" | false
  yAxisPosition?: "left" | "right" | false
  cWidth: number
  cHeight: number
  EXTRA_LEGEND_MARGIN: number
  fontSize?: number
}

export type LegendPos = boolean | "top" | "bottom" | "left" | "right" 
          | "top-left" | "top-right" | "bottom-left" | "bottom-right" 
          | "left-bottom" | "right-bottom" | "left-top" | "right-top";

export type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

export type xAccessorFunc = (d: any) => number | Date

export type yAccessorFunc = (d: any) => number

export type Domain = number | Date | undefined

export interface VoronoiProps {
  fill: string
  stroke: string
  opacity: number
  d: string | undefined
}
export interface VoronoiBody {
  data: Data
  voronoi: d3.Voronoi<string>
  xScale: ScaleFunc
  yScale: ScaleFunc
  xAccessor: xAccessorFunc
  yAccessor: yAccessorFunc
  setTooltip: React.Dispatch<any> | undefined
}
export type GroupAccessorFunc = (d: any) => number | Date
