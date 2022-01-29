import * as d3 from 'd3';
import React from 'react';
export interface Data {
  [key: string]: any;
}

export interface toolTipState {
  cursorX: number,
  cursorY: number,
  distanceFromTop: number,
  distanceFromRight: number,
  distanceFromLeft: number,
  data: any,
}

export interface ScatterPlotProps<T> {
  data: Data[];
  height?: T;
  width?: T;
  xKey: string;
  xDataType?: 'date' | 'number';
  yKey: string;
  groupBy?: string;
  xAxis?: 'top' | 'bottom' | false;
  yAxis?: 'left' | 'right' | false;
  xGrid?: boolean;
  yGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: LegendPos;
  legendLabel?: string;
  chartType?:
    | 'scatter-plot'
    | 'line-chart'
    | 'area-chart'
    | 'bar-chart'
    | 'pie-chart'
    | undefined;
  colorScheme?:
    | 'schemeRdYlGn'
    | 'schemeRdYlBu'
    | 'schemeRdGy'
    | 'schemeRdBu'
    | 'schemePuOr'
    | 'schemePiYG'
    | 'schemePRGn'
    | 'schemeBrBG'
    | 'schemeReds'
    | 'schemePurples'
    | 'schemeOranges'
    | 'schemeGreys'
    | 'schemeGreens'
    | 'schemeBlues'
    | 'schemeSpectral';
}

export interface BarChartProps<T> {
  data: Data[];
  height?: T;
  width?: T;
  xKey: string;
  yKey: string;
  groupBy?: string;
  xAxis?: 'top' | 'bottom' | false;
  yAxis?: 'left' | 'right' | false;
  yGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: LegendPos;
  legendLabel?: string;
  chartType?:
    | 'scatter-plot'
    | 'line-chart'
    | 'area-chart'
    | 'bar-chart'
    | 'pie-chart'
    | undefined;
  colorScheme?:
    | 'schemeRdYlGn'
    | 'schemeRdYlBu'
    | 'schemeRdGy'
    | 'schemeRdBu'
    | 'schemePuOr'
    | 'schemePiYG'
    | 'schemePRGn'
    | 'schemeBrBG'
    | 'schemeReds'
    | 'schemePurples'
    | 'schemeOranges'
    | 'schemeGreys'
    | 'schemeGreens'
    | 'schemeBlues'
    | 'schemeSpectral';
}

export interface LineChartProps<T> {
  data: Data[];
  dataTestId?: string;
  height?: T;
  width?: T;
  xKey: string;
  xDataType?: 'date' | 'number';
  yKey: string;
  groupBy?: string;
  xAxis?: 'top' | 'bottom' | false;
  yAxis?: 'left' | 'right' | false;
  xGrid?: boolean;
  yGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: LegendPos;
  legendLabel?: string;
  chartType?:
    | 'scatter-plot'
    | 'line-chart'
    | 'area-chart'
    | 'bar-chart'
    | 'pie-chart'
    | undefined;
  colorScheme?:
    | 'schemeRdYlGn'
    | 'schemeRdYlBu'
    | 'schemeRdGy'
    | 'schemeRdBu'
    | 'schemePuOr'
    | 'schemePiYG'
    | 'schemePRGn'
    | 'schemeBrBG'
    | 'schemeReds'
    | 'schemePurples'
    | 'schemeOranges'
    | 'schemeGreys'
    | 'schemeGreens'
    | 'schemeBlues'
    | 'schemeSpectral';
}

export interface AreaChartProps<T> {
  data: Data[];
  height?: T;
  width?: T;
  xKey: string;
  xDataType?: 'date' | 'number';
  yKey: string;
  groupBy?: string;
  xAxis?: 'top' | 'bottom' | false;
  yAxis?: 'left' | 'right' | false;
  xGrid?: boolean;
  yGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: LegendPos;
  legendLabel?: string;
  chartType?:
    | 'scatter-plot'
    | 'line-chart'
    | 'area-chart'
    | 'bar-chart'
    | 'pie-chart'
    | undefined;
  colorScheme?:
    | 'schemeRdYlGn'
    | 'schemeRdYlBu'
    | 'schemeRdGy'
    | 'schemeRdBu'
    | 'schemePuOr'
    | 'schemePiYG'
    | 'schemePRGn'
    | 'schemeBrBG'
    | 'schemeReds'
    | 'schemePurples'
    | 'schemeOranges'
    | 'schemeGreys'
    | 'schemeGreens'
    | 'schemeBlues'
    | 'schemeSpectral';
}

export interface PieChartProps {
  data: any;
  innerRadius?: number | string | undefined;
  label: string;
  legend?: LegendPos;
  legendLabel?: string;
  outerRadius?: number | string | undefined;
  pieLabel?: boolean;
  value: string;
  chartType?:
    | 'scatter-plot'
    | 'line-chart'
    | 'area-chart'
    | 'bar-chart'
    | 'pie-chart'
    | undefined;
  colorScheme?:
    | 'schemeRdYlGn'
    | 'schemeRdYlBu'
    | 'schemeRdGy'
    | 'schemeRdBu'
    | 'schemePuOr'
    | 'schemePiYG'
    | 'schemePRGn'
    | 'schemeBrBG'
    | 'schemeReds'
    | 'schemePurples'
    | 'schemeOranges'
    | 'schemeGreys'
    | 'schemeGreens'
    | 'schemeBlues'
    | 'schemeSpectral';
}

export interface PieChartBodyProps {
  data: any;
  height: number;
  width: number;
  innerRadius: number;
  outerRadius: number;
  value: string;
  label: string;
  legend?: boolean;
  colorScheme?: string;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ContinuousAxisProps {
  dataTestId?: string;
  x: number;
  y: number;
  xGrid?: boolean;
  yGrid?: boolean;
  scale:
    | d3.ScaleLinear<number, number, never>
    | d3.ScaleTime<number, number, never>;
  type: 'top' | 'right' | 'bottom' | 'left';
  height: number;
  width: number;
  margin: Margin;
  xTicksValue?: any;
  chartType?:
    | 'bar-chart'
    | 'line-chart'
    | 'area-chart'
    | 'scatter-plot'
    | 'pie-chart';
}

export interface DiscreteAxisProps {
  dataTestId?: string;
  x: number;
  y: number;
  xGrid?: boolean;
  yGrid?: boolean;
  scale: d3.ScaleBand<string>;
  type: 'top' | 'right' | 'bottom' | 'left';
  width: number;
  margin: Margin;
  data: Data[];
  xAccessor: (d: Data) => string;
  setTickMargin: React.Dispatch<any>;
  chartType?:
    | 'bar-chart'
    | 'line-chart'
    | 'area-chart'
    | 'scatter-plot'
    | 'pie-chart';
}

export interface TooltipProps {
  chartType?:
    | 'bar-chart'
    | 'line-chart'
    | 'area-chart'
    | 'scatter-plot'
    | 'pie-chart';
  data: any;
  xAccessor?: xAccessorFunc;
  yAccessor?: yAccessorFunc;
  cursorX: number;
  cursorY: number;
  distanceFromTop: number;
  distanceFromRight: number;
  distanceFromLeft: number;
  xKey?: string;
  yKey?: string;
}

export interface CircleProps {
  cx: number;
  cy: number;
  r?: string;
  color: string;
}

export interface RectangleProps {
  data: Data;
  dataTestId?: string;
  x: number | undefined;
  y: number;
  width: number;
  height: number;
  margin: Margin;
  fill: string;
  setTooltip?: React.Dispatch<any>;
}

export interface LineProps {
  fill?: string;
  stroke: string;
  strokeWidth?: string;
  d: string | undefined;
  id?: string | number;
}

export interface ArcProps {
  data: Record<string,unknown>;
  dataTestId?: string;
  key: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  d: string | undefined;
  id?: string | number;
  cellCenter?: { cx: number; cy: number; tooltipData: Data };
  setTooltip?: React.Dispatch<any>;
}

// eslint-disable-next-line import/export
export interface VoronoiProps {
  fill: string;
  stroke: string;
  opacity: number;
  d: string | undefined;
  cellCenter: { cx: number; cy: number; tooltipData: Data };
  data?: any;
  setTooltip?: React.Dispatch<any>;
  margin: Margin;
}

export type ColorScale = d3.ScaleOrdinal<string, string, never>;

export interface ColorLegendProps {
  colorScale: ColorScale;
  dataTestId?: string;
  tickSpacing?: number;
  circleRadius: number;
  tickTextOffset?: number;
  legendLabel?: string;
  labels: string[];
  legendPosition: LegendPos;
  legendWidth: number;
  legendHeight: number;
  xPosition?: number;
  yPosition?: number;
  setLegendOffset: React.Dispatch<any>;
  margin: Margin;
  xAxisPosition?: 'top' | 'bottom' | false;
  yAxisPosition?: 'left' | 'right' | false;
  cWidth: number;
  cHeight: number;
  EXTRA_LEGEND_MARGIN: number;
  fontSize?: number;
}

export type LegendPos =
  | boolean
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-bottom'
  | 'right-bottom'
  | 'left-top'
  | 'right-top';

export type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>;

export type xAccessorFunc = (d: any) => number | Date;

export type yAccessorFunc = (d: any, i?: number) => number;

export type Domain = number | Date | undefined;

export interface VoronoiBody {
  data: Data;
  voronoi: d3.Voronoi<string>;
  xScale: ScaleFunc;
  yScale: ScaleFunc;
  xAccessor: xAccessorFunc;
  yAccessor: yAccessorFunc;
  setTooltip: React.Dispatch<any> | undefined;
  margin: Margin;
}
export type GroupAccessorFunc = (d: any) => number | Date;
