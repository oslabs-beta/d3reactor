/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import * as d3 from 'd3';

export const useD3 = (
  renderChartFn: (
    arg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ) => void,
  dependencies: any[]
) => {
  const ref = React.useRef<SVGSVGElement>(null as unknown as SVGSVGElement);
  React.useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies);
  return ref;
};
