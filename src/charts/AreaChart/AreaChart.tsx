/** App.js */
import React, { useState, useEffect, useRef } from "react";
import useEnvEffect from '../../hooks/useEnvEffect';
import * as d3 from "d3";
import AreaChartBody from "./AreaChartBody";
import { AreaChartProps } from '../../../types';


export default function AreaChart({
  data,
  height = "100%",
  width = "100%",
  xKey,
  yKey,
  xDataType,
  groupBy,
  xAxis = 'bottom',
  yAxis = 'left',
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10
}:AreaChartProps<string | number>):JSX.Element {

  const anchor = useRef(null as unknown as SVGSVGElement);
  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);
  const [cHeight, setCHeight] = useState<number>(0);
  const [cWidth, setCWidth] = useState<number>(0);

  function updateSize() {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }

  // Set up an event listener on mount
  useEnvEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const container = anchor.current.getBoundingClientRect();
    setCHeight(container.height);
    setCWidth(container.width);
  }, [windowSize]);

  // IF data is structured the wrong way, convert:
  // let dataTransformed;
  // dataTransformed = transformCountryData(data); //TODO: add conditional (requires typing input data)

  return (
      <svg ref={anchor} width={width} height={height}>
        <AreaChartBody
          height={cHeight}
          width={cWidth}
          data={data}
          xKey={xKey}
          xDataType={xDataType}
          yKey={yKey}
          groupBy={groupBy}
          xAxis={xAxis}
          yAxis={yAxis}
          xGrid={xGrid}
          yGrid={yGrid}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          colorScheme={colorScheme}
        />
      </svg>
  );
}