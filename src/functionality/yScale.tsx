import * as d3 from 'd3';
import { Margin, Data, Domain, yAccessorFunc } from '../../types';

export function yScaleDef(
  data: Data[],
  yAccessor: yAccessorFunc,
  margin: Margin,
  height: number,
  groupBy?: string
) {
  let yMin: number;
  let yMax: number;

  if (groupBy) {
    yMax = d3.max(data, (layer: any) => {
      // scan each layer's data points for the highest value
      return d3.max(layer, (sequence: [number, number, any]) => sequence[1]);
    }) as number;
    yMin = d3.min(data, (layer: any) => {
      // scan each layer's data points for the lowest value
      return d3.min(layer, (sequence: [number, number, any]) => sequence[0]);
    }) as number;
  } else {
    yMax = d3.max(data, yAccessor) as number;
    yMin = Math.min(0, d3.min(data, yAccessor) as number);
  }
  const rangeMax = height - margin.top - margin.bottom;
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([rangeMax > 40 ? rangeMax : 40, 0])
    .nice();
  return yScale;
}
