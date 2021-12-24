import React from "react"
import * as d3 from "d3"

import {
  Data,
  Margin,
  ScaleFunc,
  xAccessorFunc,
  yAccessorFunc,
} from "../../types"

export default function ListeningRect({
  data,
  layers,
  width,
  height,
  margin,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
}: {
  data: Data[]
  layers: d3.Series<
    {
      [key: string]: number
    },
    string
  >[]
  width: number
  height: number
  margin: Margin
  xScale: ScaleFunc
  yScale: ScaleFunc
  xAccessor: xAccessorFunc
  yAccessor: yAccessorFunc
}) {
  function onMouseMove(e: any) {
    const mousePosition = d3.pointer(e)
    const hoveredX = xScale.invert(mousePosition[0]) as Date
    const hoveredY = yScale.invert(mousePosition[1])
    // console.log("HOVERED Y ", hoveredY)

    // ****************************************
    // Find x position
    // ****************************************
    const getDistanceFromHoveredX = function (d: any) {
      // This StackOverFlow Article helped me with this TS issue
      // https://stackoverflow.com/questions/48274028/the-left-hand-and-right-hand-side-of-an-arithmetic-operation-must-be-of-type-a
      return Math.abs(xAccessor(d).valueOf() - hoveredX.valueOf())
    }

    const closestXIndex = d3.leastIndex(data, (a, b) => {
      return getDistanceFromHoveredX(a) - getDistanceFromHoveredX(b)
    })

    if (typeof closestXIndex === "number") {
      const closestDataPoint = data[closestXIndex]
      const closestXValue = xAccessor(closestDataPoint)
    }

    // ****************************************
    // Find y position
    // ****************************************

    // closestYSequence returns the relevant sequence
    const closestYSequence = layers.map((layer) => {
      if (typeof closestXIndex === "number") {
        return layer[closestXIndex][1]
      }
    })

    // if (typeof closestXIndex === "number") {
    // Found the solution here: https://stackoverflow.com/questions/54736011/custom-typescript-type-guard-for-not-undefined-in-separate-function
    // console.log("y Accessor test ", yScale(closestYSequence[0].max))
    //     console.log("Closest sequence ", closestYSequence)
    //     if (closestYSequence instanceof Array && typeof closestYSequence[0] === 'number')
    //     console.log("y Accessor test ", d3.bisect(closestYSequence, yScale(hoveredY))
    // }

    const getDistanceFromHoveredY = function (d: any) {
      // console.log("DATA IN HOVERED Y ", d)
      // This StackOverFlow Article helped me with this TS issue
      // https://stackoverflow.com/questions/48274028/the-left-hand-and-right-hand-side-of-an-arithmetic-operation-must-be-of-type-a
      // console.log("Y SCALE ", yScale(d))
      // console.log("HOVERED Y ", hoveredY.valueOf())
      // console.log("Returned value ", Math.abs(yScale(d) - hoveredY.valueOf()))
      return Math.abs(d - hoveredY.valueOf())
    }

    const closestYIndex = d3.leastIndex(closestYSequence, (a, b) => {
      // This post help me with the below TS issue https://stackoverflow.com/questions/54884488/how-can-i-solve-the-error-ts2532-object-is-possibly-undefined
      // console.log(`A ${a}, B ${b}`)
      // console.log(
      //   "Returned value ",
      //   getDistanceFromHoveredY(a) - getDistanceFromHoveredY(b)
      // )
      console.log("Dist from A ", getDistanceFromHoveredY(a))
      console.log("Dist from B ", getDistanceFromHoveredY(b))
      return getDistanceFromHoveredY(a) - getDistanceFromHoveredY(b)
    })

    if (typeof closestYIndex === "number") {
      console.log("Closest Y index ", closestYIndex)
      // const closestDataPoint = data[closestYIndex]
      // console.log("Closest data ", closestDataPoint)
      // const closestYValue = yAccessor(closestDataPoint)
      // console.log(`Closest Y ${closestYValue}`)
    }
  }

  return (
    <rect
      width={width - margin.right - margin.left}
      height={height - margin.bottom - margin.top}
      fill="transparent"
      onMouseMove={onMouseMove}
    />
  )
}
