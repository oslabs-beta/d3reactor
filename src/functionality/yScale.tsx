import * as d3 from 'd3';
import { Margin, Data, Domain, yAccessorFunc } from "../../types"


export function yScaleDef (data: Data[], yAccessor: yAccessorFunc, margin: Margin, height: number, chart?: string) {

  const [yMin, yMax] = chart === 'AreaChart' ? [0, d3.max(data, (layer: any) => d3.max(layer, (sequence:[number, number, any]) => sequence[1]))] 
               : d3.extent(data, yAccessor) 

  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height - margin.top - margin.bottom, 0])
    .nice()
    return yScale;
  }