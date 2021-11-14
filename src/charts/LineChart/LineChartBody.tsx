/** LineChart.js */
import React, {useMemo} from 'react';
import * as d3 from "d3";
import styled from "styled-components";
import Axis from "../../components/Axis";
import {Props} from '../../../types'
import {getXAxisCoordinates, getYAxisCoordinates, getMargins} from '../../utils'

const Path = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 2px;
`;

type AccessorFunc = (d: any) => number | Date;
type ScaleFunc = d3.ScaleLinear<number, number, never> | d3.ScaleTime<number, number, never>;

const LineChartBody = ({
                         data,
                         height,
                         width,
                         xDataProp,
                         yDataProp,
                         xAxis,
                         yAxis,
                         xAxisLabel,
                         yAxisLabel
                       }: Props<number>): JSX.Element => {
  const margin = useMemo(() =>  getMargins(xAxis, yAxis, xAxisLabel, yAxisLabel), [xAxis, yAxis, xAxisLabel, yAxisLabel])

  const {
    xAxisX,
    xAxisY
  } = useMemo(() => getXAxisCoordinates(xAxis, height, margin), [height, xAxis, margin])

  const {
    yAxisX,
    yAxisY
  } = useMemo(() => getYAxisCoordinates(yAxis, width, margin), [width, yAxis, margin])

  const translate = `translate(${margin.left}, ${margin.top})`;

  let xAccessor:AccessorFunc = (d) => d[xDataProp.key];
  let xScale:ScaleFunc = d3
    .scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data, xAccessor))
    .range([0, width - margin.right - margin.left]);

  switch (xDataProp.type) {
    case ('date'):
      xAccessor = (d) => new Date(d[xDataProp.key]);
      xScale = d3
        .scaleTime()
        // @ts-ignore
        .domain(d3.extent(data, xAccessor))
        .range([0, width - margin.right - margin.left]);
      break;
    case ('string'): // TODO Example of how we could add other types
      //
      //
      break;
  }

  let yAccessor:AccessorFunc = (d) => d[yDataProp.key];
  let yScale:ScaleFunc = d3
    .scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data, yAccessor))
    .rangeRound([height - margin.bottom - margin.top, 0]);

  switch (yDataProp.type) {
    case ('date'):
      yAccessor = (d) => new Date(d[yDataProp.key]);
      yScale = d3
        .scaleTime()
        // @ts-ignore
        .domain(d3.extent(data, yAccessor))
        .range([height - margin.bottom - margin.top, 0]);
      break;
    case ('string'): // TODO Example of how we could add other types
      //
      //
      break;
  }


  // @ts-ignore
  const line:any = d3
  // @ts-ignore
    .line()
  // @ts-ignore
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  return (
    <g transform={translate}>
      <Path className="line" d={line(data)} />
      {yAxis && <Axis x={yAxisX} y={yAxisY} height={height} width={width} margin={margin} scale={yScale} type={yAxis} label={yAxisLabel}/>}
      {xAxis && <Axis x={xAxisX} y={xAxisY} height={height} width={width} margin={margin} scale={xScale} type={xAxis} label={xAxisLabel}/>}
    </g>
  );
};

export default LineChartBody;