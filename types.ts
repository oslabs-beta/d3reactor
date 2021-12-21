import { resolveModuleName } from "typescript"

// import in the propNames 
// const userDefinedPropNames = { xVal: 'date', yVal: 'value', group: 'fruit' } as const

// interface PreData {
//   xVal: number,
//   yVal: number,
//   group: string
// }

// type RenameProps<KeyMap extends Record<keyof ValueMap, string>, ValueMap> = {
//   [K in keyof ValueMap as `${KeyMap[K]}`]: ValueMap[K]
// }

// export type Data = RenameProps<typeof userDefinedPropNames, PreData>


export interface Data {
  [key: string]: any
}


export interface ScatterProps<T> {
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
}

export interface BarProps<T> {
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
}

export interface LineProps<T> {
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
}

export interface AreaProps<T> {
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
}

export interface PieChartProps {
  data: any
  value: string
  label: string
  innerRadius?: number | string | undefined
  outerRadius?: number | string | undefined
  colorScheme?: string[] | readonly string[]
  legend?: boolean
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
  type: string
  label: string | undefined
  height: number
  width: number
  margin: Margin
  xTicksValue?: any;
}

export interface DiscreteAxisProps {
  x: number
  y: number
  xGrid?: boolean
  yGrid?: boolean
  scale: d3.ScaleBand<string>
  type: string
  label: string | undefined
  height: number
  width: number
  margin: Margin
}

export interface CircleProps {
  cx: number
  cy: number
  r?: number
  color: string
}

export type ColorScale = d3.ScaleOrdinal<string, string, never>

export interface ColorLegendProps {
  colorScale: ColorScale,
  tickSpacing?: number
  circleRadius: number
  tickTextOffset?: number
  colorLegendLabel?: string
  xPosition?: number
  yPosition?: number
  legendPosition?: 'right-center' |'right-top' |'right-bottom' 
  fontSize?: number
}
export type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>

export type AccessorFunc = (d: any) => number | Date;

export type Domain = number | Date | undefined;

export interface VoronoiProps {
  fill: string
  stroke: string
  opacity: number
  d: string | undefined
}



