import React, { useMemo } from "react"
import * as d3 from "d3"
import { useD3 } from "../hooks/useD3"
import { DiscreteAxisProps, Data } from "../../types"
import { getAxisLabelCoordinates } from "../utils"

export const DiscreteAxis = React.memo(({
  x,
  y,
  scale,
  type,
  label,
  width,
  height,
  margin,
  data, 
  layers,
  xAccessor
}: DiscreteAxisProps): JSX.Element => {
 



  // const gRef = useD3(
  //   (anchor) => {
  //     let axis = d3.axisBottom(scale)
  //     switch (type) {
  //       case "bottom":
  //         axis = d3.axisBottom(scale)
  //         break
  //       case "top":
  //         axis = d3.axisTop(scale)
  //         break
  //       case "left":
  //         axis = d3.axisLeft(scale)
  //         break
  //       case "right":
  //         axis = d3.axisRight(scale)
  //         break
  //       default:
  //         axis = d3.axisRight(scale)
  //         break
  //     }

  //     anchor.call(axis)
  //   },
  //   [type, scale]
  // )

  const { axisLabelX, axisLabelY, rotate } = useMemo(
    () => getAxisLabelCoordinates(x, y, height, width, margin, type),
    [x, y, width, height, margin, type]
  )

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

  default:
    x1 = 0
    y1 = 0
    x2 = 0
    y2 = 0
    break
}

const getTickTranslation = (
  axisType: string,
  individualTick: string
): string => {
  switch (axisType) {
    case "top":
      return `translate(${scale.bandwidth()/2 + (scale(individualTick) ?? 0)}, ${y - 8})`
    case "bottom":
      return `translate(${scale.bandwidth()/2 + (scale(individualTick) ?? 0)}, ${y + 18})`
    default:
      return `translate(0,0)`
  }
}

const getTickStyle = (
  axisType: string,
  individualTick: Data
): any => { // TODO remove any
  switch (axisType) {
    case "top":
      return { textAnchor: "middle", dominantBaseline: "auto" }
    case "bottom":
      return { textAnchor: "middle", dominantBaseline: "auto" }
  }
}



// const horizontalTicks = scale.ticks(width/120)
// const verticalTicks = scale.ticks(numberOfVerticalTicks)
// console.log('vt',verticalTicks)
const ticks = data.map(d => xAccessor(d))

const formatTick = d3.timeFormat("%x")
const getFormattedTick = (individualTick: string )  => {
  if (!isNaN(Date.parse(individualTick))) {
    return formatTick(new Date(individualTick))
  } else {
    return individualTick
  }
}

  return (
    <g>
      <line stroke="#bdc3c7" x1={x1} y1={y1} x2={x2} y2={y2} />
      {ticks.map((tick: any, i: number) => (
        <text 
          style={getTickStyle(type, tick)}
          transform={getTickTranslation(type, tick)}>
          {getFormattedTick(tick)}</text>
      ))}
      <text
        transform={`translate(${axisLabelX}, ${axisLabelY}) rotate(${rotate})`}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  )
})
