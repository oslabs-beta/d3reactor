/** LineChart.js */
import React, {useMemo} from 'react';
import * as d3 from "d3";
import Axis from "../../components/Axis";
import {Props} from '../../../types'
import {getXAxisCoordinates, getYAxisCoordinates, getMargins} from '../../utils'

const AreaChartBody = ({
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

  const xAccessor = (d: {[key: string]: number}) => d[xDataProp]; // TODO: BUMP UP TO OPTIONS FOR AREACHART
  const yAccessor = (d:{[key: string]: number}) => d[yDataProp];

  const [xMin, xMax] = d3.extent(data, xAccessor);
  const [yMin, yMax] = d3.extent(data, yAccessor);

  interface Entry {
    [key: string]: string | number
  }
  const xScale = 
  // data.every((entry: Entry) => {
  //   entry.date // what am i trying to do here? ########## (confirm that every entry can be successfully converted to a Date. but is this the best approach?)
  // })
  true
  ?
  d3
    .scaleTime()
    .domain([data[0].date, data[data.length-1].date])
    .range([0, width])
  :
  d3
    .scaleLinear()
    .domain([xMin ?? 0, xMax ?? 0]).nice()
    .range([0, width - margin.right - margin.left]);

  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0]).nice()
    .rangeRound([height - margin.bottom - margin.top, 0]);

  return (
    <g transform={translate}>
      {yAxis && <Axis x={yAxisX} y={yAxisY} height={height} width={width} margin={margin} scale={yScale} type={yAxis} label={yAxisLabel}/>}
      {xAxis && <Axis x={xAxisX} y={xAxisY} height={height} width={width} margin={margin} scale={xScale} type={xAxis} label={xAxisLabel}/>}
    </g>
  );
};

export default AreaChartBody;