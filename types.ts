export interface ScatterProps<T> {
  data: any
  height?: T
  width?: T
  xData: { key: string; dataType: "date" | "number" }
  yData: { key: string; dataType: "date" | "number" }
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
  data: any
  height?: T
  width?: T
  xData: { key: string; dataType: "date" | "number" }
  yData: { key: string; dataType: "date" | "number" }
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
}

export interface LineProps<T> {
  data: any
  height?: T
  width?: T
  xData: { key: string; dataType: "date" | "number" }
  yData: { key: string; dataType: "date" | "number" }
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface AreaProps<T> {
  data: any
  height: T
  width: T
  xData: { key: string; dataType: "date" | "number" } // TODO: make dataType optional
  yData: { key: string; dataType: "date" | "number" } // TODO: make dataType optional
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[]
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
