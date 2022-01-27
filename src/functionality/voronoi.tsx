import * as d3 from 'd3';
import {
  Margin,
  Data,
  ScaleFunc,
  xAccessorFunc,
  yAccessorFunc,
} from '../../types';

export function d3Voronoi(
  data: Data[],
  xScale: ScaleFunc,
  yScale: d3.ScaleLinear<number, number, never>,
  xAccessor: xAccessorFunc,
  yAccessor: yAccessorFunc,
  height: number,
  width: number,
  margin: Margin
) {
  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );
  let voronoi: d3.Voronoi<string> = null as unknown as d3.Voronoi<string>;
  const xMax = width - margin.right - margin.left;
  const yMax = height - margin.bottom - margin.top;
  if (height && width) {
    voronoi = delaunay.voronoi([
      0,
      0,
      xMax > 40 ? xMax : 40,
      yMax > 40 ? yMax : 40,
    ]);
  }
  return voronoi;
}
