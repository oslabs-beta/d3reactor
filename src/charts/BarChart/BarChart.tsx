/** App.js */
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import BarChartBody from "./BarChartBody"
import { BarProps } from "../../../types"

export default function BarChart({
  data,
  height = "100%",
  width = "100%",
  xData,
  yData,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
}: BarProps<string | number>): JSX.Element {
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
      <BarChartBody
        data={data}
        height={cHeight}
        width={cWidth}
        xData={xData}
        yData={yData}
        groupBy={groupBy}
        xAxis={xAxis}
        yAxis={yAxis}
        yGrid={yGrid}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
      />
    </svg>
  )
}
