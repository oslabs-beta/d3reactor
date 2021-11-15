/** LineChart.js */
import React, {useMemo} from 'react';
import * as d3 from "d3";
import Axis from "../../components/Axis";
import Circle from './Circle';
import {Props} from '../../../types'
import {getXAxisCoordinates, getYAxisCoordinates, getMargins} from '../../utils'

const ScatterChartBody = ({
  data,
  height,
  width,
  xDataProp,
  yDataProp,
  xAxis,
  yAxis,
  xGrid,
  yGrid,
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

  const xAccessor = (d: {[key: string]: number}) => d[xDataProp];
  const yAccessor = (d:{[key: string]: number}) => d[yDataProp];

  const [xMin, xMax] = d3.extent(data, xAccessor);
  const [yMin, yMax] = d3.extent(data, yAccessor);

  const xScale = d3
    .scaleLinear()
    .domain([xMin ?? 0, xMax ?? 0]).nice()
    .range([0, width - margin.right - margin.left]);

  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0]).nice()
    .rangeRound([height - margin.bottom - margin.top, 0]);

  return (
    <g className='spbody' transform={translate}>
      {yAxis && <Axis x={yAxisX} y={yAxisY} yGrid={yGrid} height={height} width={width} margin={margin} scale={yScale} type={yAxis} label={yAxisLabel}/>}
      {xAxis && <Axis x={xAxisX} y={xAxisY} xGrid={xGrid} height={height} width={width} margin={margin} scale={xScale} type={xAxis} label={xAxisLabel}/>}
      {data.map((element: {[key: string]: number}, i:number) => <Circle key={i} cx={xScale(xAccessor(element))} cy={yScale(yAccessor(element))} r={5} color='steelblue'/>)}
    </g>
  );
};

export default ScatterChartBody;