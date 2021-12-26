import * as d3 from 'd3';
import { Margin, Data, ScaleFunc, xAccessorFunc } from "../../types"



export function xScaleDef (data: Data[], xDataType: 'date' | 'number', xAccessor: xAccessorFunc, margin: Margin, width: number, chart: 'ScatterPlot' | 'LineChart' | 'AreaChart' | 'BarChart') { 
  let xScale: ScaleFunc;
  const [xMin, xMax] = d3.extent(data, xAccessor)
  switch (xDataType) {
    case "number":
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        chart === 'ScatterPlot' ? 
        xScale.nice() : null
      break
    case "date":
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        chart === 'ScatterPlot' ? 
        xScale.nice() : null
      break
  }

    return {xScale, xMin, xMax};
  }