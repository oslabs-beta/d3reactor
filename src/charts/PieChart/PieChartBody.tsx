import * as d3 from "d3"
import { PieChartBodyProps } from "../../../types"
import { ColorLegend } from "../../components/ColorLegend"

const PieChartBody = ({
  data,
  outerRadius,
  innerRadius,
  height, 
  width,
  value,
  label,
  colorScheme,
  legend
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
        { // If legend prop is true, render legend component:
        legend && <ColorLegend 
          colorLegendLabel={'Fruit' /**we need a way to derive this either from data or as an extra prop passed in */} 
          xPosition={outerRadius+15 /* Where legend is placed on page */}
          yPosition={outerRadius-60 /* Where legend is placed on page */}
          tickSpacing={22 /* Vertical space between each line of legend */}
          circleRadius={10 /* Radius of each color swab in legend */}
          tickTextOffset={12 /* How much the text label is pushed to the right of the color swab */}
          colorScale={colorScale}
        />}
      </g>
    )

 
}

export default PieChartBody
