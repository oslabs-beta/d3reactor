import React, { useMemo } from "react"
import * as d3 from "d3"
import { useD3 } from "../hooks/useD3"
import { ContinuousAxisProps } from "../../types"
import { getAxisLabelCoordinates } from "../utils"
import { Line } from "./Line"

function Axi({
  x,
  y,
  scale,
  type,
  label,
  width,
  height,
  margin,
  xGrid,
  yGrid,
  xTicksValue,
}: ContinuousAxisProps): JSX.Element {
  console.log("axis")
  // const gRef = useD3(
  //   (anchor) => {
  let axis: d3.Axis<d3.NumberValue>

  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0
  switch (type) {
    case "bottom":
      x1 = x
      y1 = y
      x2 = width - margin.right - margin.left
      y2 = y
      break
    case "top":
      x1 = x
      y1 = y
      x2 = width - margin.right - margin.left
      y2 = y
      break
    case "left":
      x1 = x
      y1 = 0
      x2 = x
      y2 = height - margin.top - margin.bottom
      break
    case "right":
      x1 = x
      y1 = y
      x2 = x
      y2 = height - margin.top - margin.bottom
      break
    default:
      x1 = 0
      y1 = 0
      x2 = 0
      y2 = 0
      break
  }

  const getTickTranslation = (
    axisType: string,
    individualTick: number | Date
  ): string => {
    switch (axisType) {
      case "top":
        return `translate(${scale(individualTick)}, ${y - 8})`
      case "right":
        return `translate(${x + 12}, ${scale(individualTick)})`
      case "bottom":
        return `translate(${scale(individualTick)}, ${y + 18})`
      case "left":
        return `translate(${x - 12}, ${scale(individualTick)})`
      default:
        return `translate(0,0)`
    }
  }

  const getTickStyle = (
    axisType: string,
    individualTick: number | Date
  ): any => { // TODO remove any
    switch (axisType) {
      case "top":
        return { textAnchor: "middle", dominantBaseline: "auto" }
      case "right":
        return { textAnchor: "start", dominantBaseline: "middle" }
      case "bottom":
        return { textAnchor: "middle", dominantBaseline: "auto" }
      case "left":
        return { textAnchor: "end", dominantBaseline: "middle" }
    }
  }

  //     anchor.call(axis)
  //   },
  //   [type, scale]
  // )

  const { axisLabelX, axisLabelY, rotate } = useMemo(
    () => getAxisLabelCoordinates(x, y, height, width, margin, type),
    [x, y, width, height, margin, type]
  )

  // let grid: JSX.Element[] = []
  // switch (true) {
  //   case type === "bottom" && xGrid:
  //     grid = (xTicksValue ? xTicksValue : scale.ticks())
  //             .map((tick:any, i:number) => (
  //         <line
  //           key={i}
  //           x1={scale(tick)}
  //           x2={scale(tick)}
  //           y1={0}
  //           y2={-height + margin.bottom + margin.top}
  //           strokeOpacity="0.2"
  //           stroke="currentColor"
  //         ></line>
  //       ))
  //     break
  //   case type === "top" && xGrid:
  //     grid = (xTicksValue ? xTicksValue : scale.ticks())
  //       .map((tick:any, i:number) => (
  //         <line
  //           key={i}
  //           x1={scale(tick)}
  //           x2={scale(tick)}
  //           y1={0}
  //           y2={height - margin.bottom - margin.top}
  //           strokeOpacity="0.2"
  //           stroke="currentColor"
  //         ></line>
  //       ))
  //     break
  //   case type === "left" && yGrid:
  //     grid = scale.ticks()
  //             .map((tick:any, i:number) => (
  //         <line
  //           key={i}
  //           x1={0}
  //           x2={width - margin.right - margin.left}
  //           y1={scale(tick)}
  //           y2={scale(tick)}
  //           strokeOpacity="0.2"
  //           stroke="currentColor"
  //         ></line>
  //       ))
  //     break
  //   case type === "right" && yGrid :
  //     grid = scale.ticks()
  //           .map((tick:any, i:number) => (
  //         <line
  //           key={i}
  //           x1={0}
  //           x2={-(width - margin.right - margin.left)}
  //           y1={scale(tick)}
  //           y2={scale(tick)}
  //           strokeOpacity="0.2"
  //           stroke="currentColor"
  //         ></line>
  //       ))

  //     break
  // }

  let numberOfHorizontalTicks: number;
  if (width < 480 ) {
    numberOfHorizontalTicks = width/ 100;
  }
  else if (width < 769) {
    numberOfHorizontalTicks = width/ 120;
  }
  else  if ( width < 1024){
    numberOfHorizontalTicks = width/ 140;
  }
  else {
    numberOfHorizontalTicks = width/ 160;
  }

  const numberOfVerticalTicks: number = height / 100
  const horizontalTicks = scale.ticks(numberOfHorizontalTicks)
  const verticalTicks = scale.ticks(numberOfVerticalTicks)
  console.log('vt',verticalTicks)

  const formatTick = d3.timeFormat("%x")
  const getFormattedTick = (individualTick: number | Date) => {
    if (typeof individualTick === "number") {
      return individualTick
    } else {
      return formatTick(individualTick)
    }
  }



  return (
    <g>
      <line stroke="#bdc3c7" x1={x1} y1={y1} x2={x2} y2={y2} />
      {(type === "top" || type === "bottom") &&
        horizontalTicks.map((tick, i) => (
          <text
            key={i}
            style={getTickStyle(type, tick)}
            transform={getTickTranslation(type, tick)}
          >
            {getFormattedTick(tick)}
          </text>
        ))}
      {(type === "right" || type === "left") &&
        verticalTicks.map((tick, i) => (
          <text
            key={i}
            style={getTickStyle(type, tick)}
            transform={getTickTranslation(type, tick)}
          >
            {getFormattedTick(tick)}
          </text>
        ))}
      {/* <g ref={gRef} transform={`translate(${x}, ${y})`}>
        {grid}
      </g> */}
      <text
        transform={`translate(${axisLabelX}, ${axisLabelY}) rotate(${rotate})`}
        textAnchor="middle"
      >
        {label}
      </text>
      ;
    </g>
  )
}

function AxisPropsAreEqual(
  prevAxis: ContinuousAxisProps,
  newAxis: ContinuousAxisProps
) {
  return (
    prevAxis.scale === newAxis.scale &&
    prevAxis.height === newAxis.height &&
    prevAxis.width === newAxis.width
  )
}

export const Axis = React.memo(Axi, AxisPropsAreEqual)
