/** AreaChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/Axis"
import { AreaProps } from "../../../types"
import { findYDomainMax } from "../../utils"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
} from "../../utils"

// const Path = styled.path`
//   fill: none;
//   stroke: black;
//   stroke-width: 2px;
// `

type AccessorFunc = (d: any) => number | Date
type Domain = number | Date | undefined
type ScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
type Series = d3.Series<
  {
    [key: string]: number
  },
  string
>[]
type Stack = d3.Stack<
  any,
  {
    [key: string]: number
  },
  string
>
type Area = d3.Area<any>
// interface Series {
//   key: string,
//   index: number,

// }

const Path = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 2px;
`

const AreaChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10, // TODO: replace with custom default color scheme?
}: AreaProps<number>): JSX.Element => {
  const margin = useMemo(
    () => getMargins(xAxis, yAxis, xAxisLabel, yAxisLabel),
    [xAxis, yAxis, xAxisLabel, yAxisLabel]
  )

  const { xAxisX, xAxisY } = useMemo(
    () => getXAxisCoordinates(xAxis, height, margin),
    [height, xAxis, margin]
  )

  const { yAxisX, yAxisY } = useMemo(
    () => getYAxisCoordinates(yAxis, width, margin),
    [width, yAxis, margin]
  )
  // offset group to match position of axes
  const translate = `translate(${margin.left}, ${margin.top})`

  const keys = [] // find the fields
  for (let key in data[0]) {
    if (key !== xDataProp.key) keys.push(key)
  }

  // make sure to sort values #######
  let x = d3
      .scaleTime()
      .domain([data[0].date, data[data.length - 1].date])
      .range([0, width]),
    // if not valid date, use scaleLinear & set domain to range of date arr
    colorScale = d3.scaleOrdinal(colorScheme) // COLORS. CUSTOMIZE BY PASSING IN ARR OF STRINGS

  let xScale: ScaleFunc,
    xAccessor: AccessorFunc,
    xMin: Domain,
    xMax: Domain,
    xExtent: Domain[]
  switch (
    xDataProp.dataType // TODO: refactor to implicitly derive data type
  ) {
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
    case "date":
      xAccessor = (d) => new Date(d[xDataProp.key])
      xMin = d3.extent(data, xAccessor)[0]
      xMax = d3.extent(data, xAccessor)[1]
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
  }

  // console.log("x Range ", xMin, xMax)

  // console.log(
  //   "xAccessor ",
  //   xAccessor({
  //     date: "Thu Feb 01 2018 00:00:00 GMT-0500 (Eastern Standard Time)",
  //     apples: 10,
  //     bananas: 20,
  //     oranges: 15,
  //   })
  // )

  // console.log(
  //   "Date ",
  //   new Date("Thu Feb 01 2018 00:00:00 GMT-0500 (Eastern Standard Time)")
  // )

  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain

  switch (yDataProp.dataType) {
    case "number":
      yAccessor = (d) => d[yDataProp.key]
      yMin = d3.extent(data, yAccessor)[0]
      yMax = findYDomainMax(data, keys)
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
    case "date":
      yAccessor = (d) => new Date(d[yDataProp.key])
      yMin = d3.extent(data, yAccessor)[0]
      yMax = findYDomainMax(data, keys) // is there a d3 function that does this?
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
  }

  // console.log("Original domain ", [yMin ?? 0, yMax ?? 0])

  const newData: any = [
    {
      month: new Date(2015, 0, 1),
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 2, 1),
      apples: 640,
      bananas: 960,
      cherries: 640,
      dates: 400,
    },
    {
      month: new Date(2015, 3, 1),
      apples: 320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ]

  const newKeys = ["apples", "bananas", "cherries", "dates"]
  const stack = d3
    .stack()
    .keys(newKeys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)

  const series = stack(newData)

  xAccessor = (d) => d.month
  xMin = d3.min(newData, xAccessor)
  xMax = d3.max(newData, xAccessor)
  xScale = d3
    .scaleTime()
    .domain([xMin ?? 0, xMax ?? 0])
    .range([xAxisX, width - margin.right - margin.left])
    .nice()

  const yDomain: any = d3.extent(series.flat(2))

  const newYScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([height - margin.top - margin.bottom, 0])
    .nice()

  // console.log("Series  ", series)

  let area: any = d3
    .area()
    .x((d: any) => xScale(d.month))
    .y0((d) => d[0])
    .y1((d) => d[1])

  // series.forEach((layer, i) => console.log("Area ", area(layer)))

  // debugger

  // let area: any = d3.area()
  //   .x((d: any, i: number) => {
  //     // console.log('d!!, ', d)
  //     // console.log('areaxAccessor(d)!! ', areaXAccessor(d));
  //     return xScale(areaXAccessor(d))})
  //     // return xScale((d: any) => d[i].data.date)})
  //   .y0((d) => {
  //     // console.log('yScale(d[0])!! ', yScale(d[0])) // ###### TODO: FIX undefined
  //     return yScale(d[0])}) // set to 0 for overlay?
  //   .y1((d) => yScale(d[1]));

  // console.log("area(data) ", area(data))

  // stack(data).map((el: any) => {
  //   console.log('area(el)^^^^^^^^^^^^^', area(el))
  //   // console.log('el^^^^^^^^^^^^^', el)
  //   return <path d={area(el)} />
  // })

  return (
    <g transform={translate}>
      {/* {stack(data).map((el: any) => (
        <path d={area(el)} />
      ))} */}
    </g>
  )
}

export default AreaChartBody
