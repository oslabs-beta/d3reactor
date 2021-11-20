/** App.js */
import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import PieChartBody from "./PieChartBody"
import { PieChartProps } from "../../../types"
import { checkRadiusDimension, calculateOuterRadius } from "../../utils"

export default function PieChart({
  data,
  outerRadius,
  innerRadius,
}: PieChartProps<number>): JSX.Element {
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

  // outerRadius = outerRadius ? checkRadiusDimension(cHeight,cWidth,margin, outerRadius): calculateOuterRadius(cHeight,cWidth,margin)
  // innerRadius = innerRadius? checkRadiusDimension(outerRadius, 0, margin,innerRadius) : 0
  return(
    <svg ref={anchor} width={"100%"} height={"100%"}>
      <PieChartBody
        data={data}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        height = {cHeight}
        width = {cWidth}
      />
    </svg>
  )
}
