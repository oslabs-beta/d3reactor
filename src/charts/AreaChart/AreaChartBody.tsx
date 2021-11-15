/** AreaChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import styled from "styled-components"
import Axis from "../../components/Axis"
import { AreaProps } from "../../../types"
import findYDomainMax from '../../utils.js'
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
  for (let key in data[0]) { // make more abstractable (what if data points are missing for some fields?)
    if (key !== 'date') keys.push(key);
  }

  // make sure to sort values #######
  let x = d3.scaleTime().domain([data[0].date, data[data.length-1].date]).range([0, width]), 
  // if not valid date, use scaleLinear & set domain to range of date arr
  
  y = d3.scaleLinear().domain([0, findYDomainMax(data, keys)]).range([height, 0]),
  z = d3.scaleOrdinal(colorScheme || defaultOptions.colorScheme); // COLORS. HOW TO CUSTOMIZE?



  let xScale: ScaleFunc, 
      xAccessor: AccessorFunc, 
      xMin: Domain, 
      xMax: Domain;


      
  switch (xDataProp.dataType) { // TODO: refactor to implicitly derive data type
    case "number":
      xAccessor = (d) => d[xDataProp.key]
      xMin = d3.extent(data, xAccessor)[0] 
      xMax = d3.extent(data, xAccessor)[1]// no need to repeat calc
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

  let yScale: ScaleFunc, yAccessor: AccessorFunc, yMin: Domain, yMax: Domain
  switch (yDataProp.dataType) {
    case "number":
      yAccessor = (d) => d[yDataProp.key]
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      console.log("Min and max ", yMin, yMax)
      yScale = d3
        .scaleLinear()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
    case "date":
      yAccessor = (d) => new Date(d[yDataProp.key])
      yMin = d3.extent(data, yAccessor)[0]
      yMax = d3.extent(data, yAccessor)[1]
      yScale = d3
        .scaleTime()
        .domain([yMin ?? 0, yMax ?? 0])
        .range([height - margin.top - margin.bottom, 0])
        .nice()
      break
  }

  // DECLARE AREA HERE


  return (
    <g transform={translate}>
      <Path className="area" d={line(data)} /> {/**MAKE INTO ITERABLE OF AREAS. DON'T USE STYLED PATH? */}
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
