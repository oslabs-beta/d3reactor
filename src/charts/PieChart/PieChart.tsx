/** App.js */
import React, { useState, useEffect, useRef } from "react";
import useEnvEffect from '../../hooks/useEnvEffect';
import PieChartBody from "./PieChartBody";
import { PieChartProps } from "../../../types"
import { checkRadiusDimension, calculateOuterRadius } from "../../utils"
import * as d3 from "d3";

export default function PieChart({
  data,
  label,
  value,
  outerRadius,
  innerRadius,
  colorScheme = d3.schemeCategory10
}: PieChartProps): JSX.Element {
  const anchor = useRef(null as unknown as SVGSVGElement)
  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0])
  const [cHeight, setCHeight] = useState<number>(0)
  const [cWidth, setCWidth] = useState<number>(0)

  function updateSize() {
    setWindowSize([window.innerWidth, window.innerHeight])
  }

  // Set up an event listener on mount
  useEnvEffect(() => {
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
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };
  outerRadius = outerRadius ? checkRadiusDimension(cHeight,cWidth, outerRadius, margin): calculateOuterRadius(cHeight,cWidth,margin)
  innerRadius = innerRadius ? checkRadiusDimension(outerRadius, outerRadius, innerRadius, margin) : 0
  return(
    <svg ref={anchor} width={"100%"} height={"100%"}>
      <PieChartBody
        data={data}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        height = {cHeight}
        width = {cWidth}
        value = {value} // value is the same as 'yKey' in other charts. Should we rename?
        label = {label} // label is the same as 'group' in other charts. Should we rename?
        colorScheme={colorScheme}
      />
    </svg>
  )
}
