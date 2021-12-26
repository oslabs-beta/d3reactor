
import { ColorLegendProps } from "../../types"

export const ColorLegend = ({
  colorScale,
  circleRadius = 10,
  tickSpacing = circleRadius*2 + 6,
  tickTextOffset = circleRadius*1.2 + 3,
  colorLegendLabel = '',
  xPosition,
  yPosition,
  setLegendOffset,
  fontSize = 16,
}: ColorLegendProps) => {
  const RECT_MARGIN = 6;
  const domain = colorScale.domain();
  let longestWord = colorLegendLabel ? colorLegendLabel.length : 0;
  const rectHeight = tickSpacing*(domain.length+1) + RECT_MARGIN*2;
  // iterate thru category names, create color swab & text for each
  const legend = domain.map((domainValue: string, i: number) => {
    if (domainValue.length > longestWord) longestWord = domainValue.length;
    return ( 
      <g className="tick" transform={`translate(${RECT_MARGIN+circleRadius}, ${(i+1) * tickSpacing + RECT_MARGIN - rectHeight/2  + circleRadius})`} key={domainValue}>
        <circle fill={colorScale(domainValue)} r={circleRadius} />
        <text x={tickTextOffset} dy='.32em'>
          {domainValue}
        </text>
      </g>
    )
  });

  const rectWidth = tickTextOffset + circleRadius + longestWord*8 + RECT_MARGIN*2;
  setLegendOffset(rectWidth)
  return (
      <g transform={`translate(${xPosition}, ${yPosition})`}>
        <rect x={0} 
              y={-rectHeight/2} 
              width={rectWidth} 
              height={rectHeight} 
              style={{
                fill:'rgb(180,180,180)', 
                strokeWidth:2, 
                stroke:'rgb(0,0,0)' 
              }}/>
        <text className={'sectionLabel' /* TODO: implement CSS */} 
          x={rectWidth/2 /* Where to put Legend title label */} 
          y={-rectHeight/2 + RECT_MARGIN/2 + 16 /* Where to put Legend title label */} 
          textAnchor={'middle'}
        >
          {colorLegendLabel}
        </text>
        { legend }
      </g>

  )
}