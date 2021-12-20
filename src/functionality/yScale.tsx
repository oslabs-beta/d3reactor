import * as d3 from 'd3';
import { Margin, Data, Domain, AccessorFunc } from "../../types"


export function yScaleDef (data: Data[], yAccessor: AccessorFunc, margin: Margin, height: number) {

  let yScale: d3.ScaleLinear<number, number, never>
  const [yMin, yMax] = d3.extent(data, yAccessor)
  yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()
    return yScale;
  }