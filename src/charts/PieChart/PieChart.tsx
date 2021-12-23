/** App.js */
import React from "react";
import * as d3 from "d3";
import { useResponsive } from '../../hooks/useResponsive';
import { PieChartProps } from "../../../types";
import { ColorLegend } from "../../components/ColorLegend";
import Line from '../../components/Line';
import { checkRadiusDimension, calculateOuterRadius } from "../../utils";

export default function PieChart({
  data,
  label,
  value,
  outerRadius,
  innerRadius,
  colorScheme = d3.schemeCategory10,
  legend
}: PieChartProps): JSX.Element {

  const {anchor, cHeight, cWidth}  = useResponsive();
  
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };
  outerRadius = outerRadius ? checkRadiusDimension(cHeight,cWidth, outerRadius, margin): calculateOuterRadius(cHeight,cWidth,margin)
  innerRadius = innerRadius ? checkRadiusDimension(outerRadius, outerRadius, innerRadius, margin) : 0

  const colors = colorScheme
  type ColorScale = d3.ScaleOrdinal<string, string, never>

  const translate = `translate(${cWidth/2}, ${cHeight/2})`
  
  const keys: string[] = []
  for (let entry of data) {
    const property = entry[label];
    if (property && !keys.includes(property)) {
      keys.push(property)
    }
  }

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

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

  return(
    <svg ref={anchor} width={"100%"} height={"100%"}>
     <g transform = {translate}  >
        {pie.map((d: any, i:number) => 
        <g key = {"g" + i} >
          <Line 
            key={d.label}
            fill={colorScale(keys[i])}
            stroke = "#ffffff"
            strokeWidth = "0px"
            d = {arcGenerator(d)}
            id = {"arc-" + i}
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
        { // If legend prop is true, render legend component:
        legend && <ColorLegend 
          colorLegendLabel={'Fruit' /**we need a way to derive this either from data or as an extra prop passed in */} 
          xPosition={outerRadius+15 /* Where legend is placed on page */}
          yPosition={0/* Where legend is placed on page */}
          circleRadius={5 /* Radius of each color swab in legend */}
          // tickSpacing={22 /* Vertical space between each line of legend */}
          // tickTextOffset={12 /* How much the text label is pushed to the right of the color swab */}
          colorScale={colorScale}
        />}
      </g>
    </svg>
  )
}
