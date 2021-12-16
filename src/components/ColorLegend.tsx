
import { ColorLegendProps } from "../../types"

export const ColorLegend = ({
  colorScale,
  tickSpacing = 20,
  circleRadius = 10,
  tickTextOffset = 20,
  colorLegendLabel,
  xPosition,
  yPosition
}: ColorLegendProps) => {
  return (
    <g transform={`translate(${xPosition}, ${yPosition})`}>
      <text className={'axisLabel' /* TODO: implement CSS */} 
        x={35 /* Where to put Legend title label */} 
        y={-20 /* Where to put Legend title label */} 
        textAnchor={'middle'}
      >
        {colorLegendLabel}
      </text>
      { 
        // iterate thru category names, create color swab & text for each
        colorScale.domain().map((domainValue: string, i: number) => ( 
          <g className="tick" transform={`translate(0, ${i * tickSpacing})`}>
            <circle fill={colorScale(domainValue)} r={circleRadius} />
            <text x={tickTextOffset} dy='.32em'>
              {domainValue}
            </text>
          </g>
        ))
      }
    </g>
  )
}