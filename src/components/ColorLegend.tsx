
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
  const RECT_MARGIN = 2;
  const domain = colorScale.domain();
  let longestWord = 0;
  // iterate thru category names, create color swab & text for each
  const legend = domain.map((domainValue: string, i: number) => {
    if (domainValue.length > longestWord) longestWord = domainValue.length;
    return ( 
      <g className="tick" transform={`translate(${RECT_MARGIN*2}, ${i * tickSpacing + RECT_MARGIN})`} key={i}>
        <circle fill={colorScale(domainValue)} r={circleRadius} />
        <text x={tickTextOffset} dy='.32em'>
          {domainValue}
        </text>
      </g>
    )
  });

  return (

      <g transform={`translate(${xPosition}, ${yPosition})`}>
        <rect x={-circleRadius} 
              y={yPosition-23} 
              width={circleRadius*3 + longestWord*8 + RECT_MARGIN*2} 
              height={tickSpacing*(domain.length+1) + RECT_MARGIN*2} 
              style={{
                fill:'rgb(180,180,180)', 
                strokeWidth:2, 
                stroke:'rgb(0,0,0)' 
              }}/>
        <text className={'sectionLabel' /* TODO: implement CSS */} 
          x={longestWord*4 + RECT_MARGIN + circleRadius/2 /* Where to put Legend title label */} 
          y={-20 + RECT_MARGIN /* Where to put Legend title label */} 
          textAnchor={'middle'}
        >
          {colorLegendLabel}
        </text>
        { legend }
      </g>

  )
}