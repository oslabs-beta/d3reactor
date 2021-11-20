export interface Props<T> {
  data: any
  height: T
  width: T
  xDataProp: { key: string; dataType: "date" | "number" }
  yDataProp: { key: string; dataType: "date" | "number" }
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
  xDataProp: { key: string; dataType: "date" | "number" } // TODO: make dataType optional
  yDataProp: { key: string; dataType: "date" | "number" } // TODO: make dataType optional
  groupBy?: string
  xAxis?: "top" | "bottom" | false
  yAxis?: "left" | "right" | false
  xGrid?: boolean
  yGrid?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  colorScheme?: string[] | readonly string[] | undefined
}






export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface AxisProps {
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

export interface CircleProps {
  cx: number
  cy: number
  r?: number
  color: string
}
