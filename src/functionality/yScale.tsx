import * as d3 from 'd3';
import { Margin, Data, Domain, AccessorFunc } from "../../types"


export function yScaleDef (data: Data[], margin: Margin, height: number, yAccessor: AccessorFunc) {

  let yScale: d3.ScaleLinear<number, number, never>, yMin: Domain, yMax: Domain
  yMin = d3.extent(data, yAccessor)[0]
  yMax = d3.extent(data, yAccessor)[1]
  yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()
    return yScale;
  }