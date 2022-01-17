import * as d3 from 'd3';
import { Margin, Data, Domain, yAccessorFunc } from '../../types';

export function yScaleDef(
  data: Data[],
  yAccessor: yAccessorFunc,
  margin: Margin,
  height: number,
  chart?: string,
  groupBy?: string
) {
  let yMin = 0;
  let yMax: number;
  if (chart === 'AreaChart' || (chart === 'BarChart' && groupBy)) {
    yMax =
      d3.max(data, (layer: any) => {
        return d3.max(layer, (sequence: [number, number, any]) => sequence[1]);
      }) ?? 0;
  } else if (chart === 'BarChart' && !groupBy) {
    yMax = d3.max(data, yAccessor) ?? 0;
  } else {
    yMax = d3.max(data, yAccessor) ?? 0;
    yMin = d3.min(data, yAccessor) ?? 0;
  }
  const rangeMax = height - margin.top - margin.bottom;
  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([rangeMax > 40 ? rangeMax : 40, 0])
    .nice();
  return yScale;
}
