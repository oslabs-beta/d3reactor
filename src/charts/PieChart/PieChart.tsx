/** App.js */
import React, { useState } from "react"
import * as d3 from "d3"
import { useResponsive } from "../../hooks/useResponsive"
import { PieChartProps } from "../../../types"
import { ColorLegend } from "../../components/ColorLegend"
import { Arc } from "../../components/Arc"
import { Tooltip } from "../../components/Tooltip"
import { checkRadiusDimension, calculateOuterRadius } from "../../utils"

export default function PieChart({
  data,
  label,
  value,
  outerRadius,
  innerRadius,
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
  legend,
}: PieChartProps): JSX.Element {

  const [legendOffset, setLegendOffset] = useState([0, 0]);
  
  const [tooltip, setTooltip] = useState<false | any>(false);
  
  const { anchor, cHeight, cWidth } = useResponsive();

  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  }
  outerRadius = outerRadius
    ? checkRadiusDimension(cHeight, cWidth, outerRadius, margin)
    : calculateOuterRadius(cHeight, cWidth, margin)
  innerRadius = innerRadius
    ? checkRadiusDimension(outerRadius, outerRadius, innerRadius, margin)
    : 0

  type ColorScale = d3.ScaleOrdinal<string, string, never>

  const translate = `translate(${cWidth / 2}, ${cHeight / 2})`

  const keys: string[] = []
  for (let entry of data) {
    const property = entry[label]
    if (property && !keys.includes(property)) {
      keys.push(property)
    }
  }

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
  colorScale.domain(keys)

  const arcGenerator: any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  const pieGenerator: any = d3
    .pie()
    .padAngle(0)
    .value((d: any) => d[value])

  const pie: any = pieGenerator(data)

  const textTranform = (d: any) => {
    const [x, y] = arcGenerator.centroid(d)
    return `translate(${x}, ${y})`
  }

  return (
    <svg ref={anchor} width={"100%"} height={"100%"}>
      <g transform={translate}>
        {pie.map((d: any, i: number) => (
          <g key={"g" + i}>
            <Arc
              key={d.label}
              fill={colorScale(keys[i])}
              stroke="#ffffff"
              strokeWidth="0px"
              d={arcGenerator(d)}
              id={"arc-" + i}
              setTooltip={setTooltip}
            />
            <text
              style={{ pointerEvents: "none" }}
              transform={textTranform(d)}
              textAnchor={"middle"}
              alignmentBaseline={"middle"}
              fill={"black"}
            >
              {d.data[value]}
            </text>
          </g>
        ))}
        { // If legend prop is truthy, render legend component:
        legend && <ColorLegend 
          colorLegendLabel={'Fruit' /**we need a way to derive this either from data or as an extra prop passed in */} 
          circleRadius={5 /* Radius of each color swab in legend */}
          // tickSpacing={22 /* Vertical space between each line of legend */}
          // tickTextOffset={12 /* How much the text label is pushed to the right of the color swab */}
          colorScale={colorScale}
          setLegendOffset={setLegendOffset}
          legendPosition={legend}
          xOffset={0}
          yOffset={0}
          margin={margin}
          cWidth={cWidth}
          cHeight={cHeight}
        />}
        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}
      </g>
    </svg>
  )
}
