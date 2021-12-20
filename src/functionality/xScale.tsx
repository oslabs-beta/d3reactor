import * as d3 from 'd3';
import { Margin, Data, ScaleFunc, AccessorFunc, Domain } from "../../types"



export function xScaleDef (data: Data[], xDataType: 'date' | 'number', xAccessor: AccessorFunc, margin: Margin, width: number) {
  let xScale: ScaleFunc, xMin: Domain, xMax: Domain
  switch (xDataType) {
    case "number":
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
    case "date":
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
  }

    return xScale;
  }