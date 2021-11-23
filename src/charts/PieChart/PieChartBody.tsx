import React from 'react';
import * as d3 from "d3";
import { PieChartBodyProps } from "../../../types"


const PieChartBody = ({
  data,
  outerRadius,
  innerRadius,
  height, 
  width,
  value,
  label,
  colorScheme
}: PieChartBodyProps): JSX.Element => {
 
  const colors = colorScheme
  type ColorScale = d3.ScaleOrdinal<string, string, never>

  const translate = `translate(${width/2}, ${height/2})`
  
  const keys: string[] = []
  for (let entry of data) {
    const property = entry[label];
    if (property && !keys.includes(property)) {
      keys.push(property)
    }
  }

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)
  

  // const colorScale = d3
  //   .scaleSequential()
  //   .interpolator(colorScheme)
  //   .domain([0, data.length]);

  const arcGenerator : any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);


  const pieGenerator : any = d3
    .pie()
    .padAngle(0)
    .value((d : any) => d[value]);

  const pie : any = pieGenerator(data)

  const textTranform = (d : any) => {
    const [x , y] = arcGenerator.centroid(d);
    return `translate(${x}, ${y})`
  }

    return (
      <g transform = {translate}  >
        {pie.map((d: any, i:number) => 
        <g key = {"g" + i} >
        <path 
          key = {d.label}
          d = {arcGenerator(d)}
          id = {"arc-" + i}
          stroke = {"#ffffff"}
          strokeWidth = {0}
          fill = {colorScale(keys[i])}
        />
        <text
          transform = {textTranform(d)}
          textAnchor = {"middle"}
          alignmentBaseline = {"middle"}
          fill = {"black"}
        >
          {d.data[value]}
        </text>
        </g>)}
      </g>
    )

 
}

export default PieChartBody
