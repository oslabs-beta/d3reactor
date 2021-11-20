/** App.js */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import PieChartBody from "./PieChartBody"
import { PieChartProps } from "../../../types"

export default function LineChart({
  data,
  outerRadius,
  innerRadius,
  pieValueProp,
  pieLabelProp
}: Props<string | number>): JSX.Element {
  const anchor = useRef(null as unknown as SVGSVGElement)
  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0])
  const [cHeight, setCHeight] = useState<number>(0)
  const [cWidth, setCWidth] = useState<number>(0)

  function updateSize() {
    setWindowSize([window.innerWidth, window.innerHeight])
  }

  // Set up an event listener on mount
  useLayoutEffect(() => {
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    const container = anchor.current.getBoundingClientRect()
    setCHeight(container.height)
    setCWidth(container.width)
  }, [windowSize])

  //ASK: how to handle margins for PieChart
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const width = 4 * outerRadius + margin.left + margin.right;
  const height = 4 * outerRadius + margin.top + margin.bottom;

    <svg ref={anchor} width={width} height={height}>
      <PieChartBody
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        data={data}
        xDataProp={xDataProp}
        yDataProp={yDataProp}
        xAxis={xAxis}
        yAxis={yAxis}
        yGrid={yGrid}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
      />
    </svg>
  )
}
