/** App.js */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import * as d3 from "d3"
import ScatterPlotBody from "./ScatterPlotBody"
import { ScatterProps } from "../../../types"

export default function ScatterPlot({
  data,
  height = "100%",
  width = "100%",
  xData,
  yData,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
}: ScatterProps<string | number>): JSX.Element {
  console.log("rendered chart")
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

  return (
    <svg ref={anchor} width={width} height={height}>
      <ScatterPlotBody
        height={cHeight}
        width={cWidth}
        data={data}
        xData={xData}
        yData={yData}
        groupBy={groupBy}
        xAxis={xAxis}
        yAxis={yAxis}
        xGrid={xGrid}
        yGrid={yGrid}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
      />
    </svg>
  )
}
