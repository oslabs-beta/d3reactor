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

  const xAccessor = (d: any) => new Date(d[xDataProp]);
  const yAccessor = (d: any) => d[yDataProp];

  // const [xMin, xMax]: [any, any] = d3.extent(data, xAccessor);
  const [yMin, yMax]: [any, any] = d3.extent(data, yAccessor);

  const xScale = d3
    .scaleTime()
    // @ts-ignore
    .domain(d3.extent(data, xAccessor))
    .range([0, width - margin.right - margin.left]);

  // @ts-ignore
  console.log('xScale ', xScale(xAccessor({date: "2019-07-15"})))

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .rangeRound([height - margin.bottom - margin.top, 0]);


  const line:any = d3
    .line()
    // @ts-ignore
    .x((d) => xScale(new Date(d[xDataProp])))
    // @ts-ignore
    .y((d) => yScale(d[yDataProp]));

  console.log(line(data))
  return (
    <g transform={translate}>
      <Path className="line" d={line(data)} />
      {yAxis && <Axis x={yAxisX} y={yAxisY} height={height} width={width} margin={margin} scale={yScale} type={yAxis} label={yAxisLabel}/>}
      {xAxis && <Axis x={xAxisX} y={xAxisY} height={height} width={width} margin={margin} scale={xScale} type={xAxis} label={xAxisLabel}/>}
    </g>
  );
};

export default LineChartBody;