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
  let yMin = d3.min(data, yAccessor) ?? 0;
  let yMax: number;

  console.log('data', data)
  console.log('groupBy', groupBy)

  if (groupBy && chart !== 'ScatterPlot') {
    yMax = // scan each layer's data points for the highest value 
    d3.max(data, (layer: any) => {
      return d3.max(layer, (sequence: [number, number, any]) => sequence[1]);
    }) as number;
  } else  { //if (!groupBy && chart === 'AreaChart')
    yMax = d3.max(data, yAccessor) ?? 0;
  }

  // if (chart === 'AreaChart' || (chart === 'BarChart' && groupBy)) {
  //   yMax = // scan each layer's data points for the highest value 
  //   d3.max(data, (layer: any) => {
  //     return d3.max(layer, (sequence: [number, number, any]) => sequence[1]);
  //   }) as number;
  // } else if (chart === 'BarChart' && !groupBy) {
  //   yMax = d3.max(data, yAccessor) ?? 0;
  // } else {
  //   yMax = d3.max(data, yAccessor) ?? 0;
  // }
  
  console.log('ymin', yMin)
  console.log('yMax', yMax)

  const rangeMax = height - margin.top - margin.bottom;
  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([rangeMax > 40 ? rangeMax : 40, 0])
    .nice();
  return yScale;
}
