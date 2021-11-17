/** AreaChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/Axis"
import { AreaProps } from "../../../types"
import { findYDomainMax } from '../../utils'
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
type Series = d3.Series<{
  [key: string]: number;
}, string>[]
type Stack = d3.Stack<any, {
  [key: string]: number;
}, string>
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
  colorScheme = d3.schemeCategory10 // TODO: replace with custom default color scheme?
}: AreaProps<number>): JSX.Element => {
  console.log('@@@@@@@data@@@@@@@@ ', data)


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

  const keys = []; // find the fields 
  for (let key in data[0]) { 
    if (key !== xDataProp.key) keys.push(key);
  }

  // make sure to sort values #######
  let x = d3.scaleTime().domain([data[0].date, data[data.length-1].date]).range([0, width]), 
  // if not valid date, use scaleLinear & set domain to range of date arr
  colorScale = d3.scaleOrdinal(colorScheme); // COLORS. CUSTOMIZE BY PASSING IN ARR OF STRINGS

  let xScale: ScaleFunc, 
      xAccessor: AccessorFunc, 
      xMin: Domain, 
      xMax: Domain,
      xExtent: Domain[];
  switch (xDataProp.dataType) { // TODO: refactor to implicitly derive data type
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xExtent = d3.extent(data, xAccessor)
      xMin = xExtent[0] 
      xMax = xExtent[1]
      xScale = d3
        .scaleLinear()
        .domain([xMin ?? 0, xMax ?? 0])
        .range([0, width - margin.right - margin.left])
        .nice()
      break
    case "date":
      xAccessor = (d) => new Date(d[xDataProp.key])
      xExtent = d3.extent(data, xAccessor)
      xMin = xExtent[0] 
      xMax = xExtent[1]
      xScale = d3
        .scaleTime()
        .domain([xMin ?? 0, xMax ?? 0])
        // .domain(d3.extent(data, (d: any) => {  // interpret date from string, Date, num. IS THIS NECESSARY OR DOES D3 DO THIS AUTOMATICALLY?
        //   if (typeof d.date === 'string') d.date = Date.parse(d.date);
        //   return +d.date; 
        // }));
        .range([0, width - margin.right - margin.left])
        .nice()
      break
  }

  let yScale: ScaleFunc, 
      yAccessor: AccessorFunc, 
      yMin: Domain, 
      yMax: Domain;

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

  let stack = d3.stack();
  stack.keys(keys);
  console.log('stack(data) is!! ', stack(data))


  // <g> 
  //   stack(data).map(el => {
  //     <path d={area(el)}/>
  //   })
  // </g> 

  colorScale.domain(keys);
  
  // xAccessor = (d) => d[xDataProp.key]
  // const areaXAccessor = (d: any, i: number) => d.data[xDataProp.key]
  const areaXAccessor = (d: any) => d.data[xDataProp.key]
  // const areaXAccessor = (d: any) => d.data["date"]
  let area: any = d3.area()
    .x((d: any) => xScale(areaXAccessor(d)))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))

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

  // console.log('area(data) is!! ', area(data))

  console.log('area(data) ', area(data))

  // stack(data).map((el: any) => {
  //   console.log('area(el)^^^^^^^^^^^^^', area(el))
  //   // console.log('el^^^^^^^^^^^^^', el)
  //   return <path d={area(el)} />
  // })

  return (
    <g transform={translate}>
      {/* <path className="area" d={area(data)}/> *MAKE INTO ITERABLE OF AREAS. DON'T USE STYLED PATH? */}
      {/* <Path className="area" d={area(stack(data))} /> */}
      {/* {stack(data).map((el: any) => {
        // console.log('area(el)^^^^^^^^^^^^^', area(el))
        // console.log('el^^^^^^^^^^^^^', el)
        return <path d={area(el)} />
      })} */}
      {yAxis && (
        <Axis
          x={yAxisX}
          y={yAxisY}
          height={height}
          width={width}
          margin={margin}
          scale={yScale}
          type={yAxis}
          label={yAxisLabel}
        />
      )}
      {xAxis && (
        <Axis
          x={xAxisX}
          y={xAxisY}
          height={height}
          width={width}
          margin={margin}
          scale={xScale}
          type={xAxis}
          label={xAxisLabel}
        />
      )}
    </g>
  )
}

export default AreaChartBody
