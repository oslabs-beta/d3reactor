
import { useEffect } from "react";
import { ColorLegendProps } from "../../types"

export const ColorLegend = ({
  colorScale,
  circleRadius = 10,
  tickSpacing = circleRadius * 2 + 6,
  tickTextOffset = circleRadius * 1.2 + 3,
  legendLabel = '',
  legendPosition,
  xOffset,
  yOffset,
  setLegendOffset,
  margin,
  cWidth,
  cHeight,
  EXTRA_LEGEND_MARGIN = 6,
  fontSize = 16,
}: ColorLegendProps) => {
  const RECT_MARGIN = 6;
  const domain = colorScale.domain();
  let longestWord: number;
  let labelHeightOffset: number;
  if (legendLabel) {
    longestWord = legendLabel.length;
    labelHeightOffset = 1.5;
  } else {
    longestWord = 0;
    labelHeightOffset = 0;
  }
  const rectHeight = tickSpacing*(domain.length + labelHeightOffset) + RECT_MARGIN*2;

// determine legend placement:
let xPosition: number = 0, 
    yPosition: number = cHeight/2 - yOffset/2;
switch(legendPosition) {
  case 'top':
    xPosition = (cWidth - margin.left - margin.right) / 2 - xOffset / 2
    yPosition = yOffset / 2 - margin.top + EXTRA_LEGEND_MARGIN;
    break;
  case 'bottom':
    xPosition = (cWidth - margin.left - margin.right) / 2 - xOffset / 2
    yPosition = cHeight - yOffset - EXTRA_LEGEND_MARGIN*2;
    break;
  case 'left-top':
    xPosition =  EXTRA_LEGEND_MARGIN - margin.left;
    yPosition = yOffset / 2 - margin.top + EXTRA_LEGEND_MARGIN;
    break;
  case 'left-bottom':
    xPosition =  EXTRA_LEGEND_MARGIN - margin.left;
    yPosition = cHeight - yOffset - EXTRA_LEGEND_MARGIN*2;
    break;
  case 'right-top':
    xPosition = cWidth - margin.left - margin.right - xOffset - EXTRA_LEGEND_MARGIN + 20;
    yPosition = yOffset / 2 - margin.top + EXTRA_LEGEND_MARGIN;
    break;
  case 'right-bottom':
    xPosition = cWidth - margin.left - margin.right - xOffset - EXTRA_LEGEND_MARGIN + 20;
    yPosition = cHeight - yOffset - EXTRA_LEGEND_MARGIN*2;
    break;
  case 'left': 
    xPosition = -margin.left - EXTRA_LEGEND_MARGIN;
    break;
  case 'top-left': 
    xPosition = -margin.left - EXTRA_LEGEND_MARGIN;
    yPosition = margin.top;
    break;
  case 'bottom-left': 
    xPosition = -margin.left - EXTRA_LEGEND_MARGIN;
    yPosition = cHeight - yOffset / 2 - margin.bottom;
    break;
  case 'top-right':
    xPosition = cWidth - margin.left - margin.right + 20;
    yPosition = margin.top;
    break;
  case 'bottom-right':
    xPosition = cWidth - margin.left - margin.right + 20;
    yPosition = cHeight - yOffset/2 - margin.bottom;
    break;
  case 'right':
  default:
    xPosition = cWidth - margin.left - margin.right + 20;
}

  // iterate thru category names, create color swab & text for each
  const legend = domain.map((domainValue: string, i: number) => {
    if (domainValue.length > longestWord) longestWord = domainValue.length;
    return ( 
      <g className="tick" 
        key={domainValue}
        transform={`translate(${RECT_MARGIN+circleRadius}, 
                   ${(i+labelHeightOffset) * tickSpacing + 
                     RECT_MARGIN - rectHeight/2 + circleRadius})`} 
        >
        <circle fill={colorScale(domainValue)} r={circleRadius} />
        <text x={tickTextOffset} dy='.32em'>
          {domainValue}
        </text>
      </g>
    )
  });

  const rectWidth = 
    tickTextOffset + circleRadius*2 
    + longestWord*(fontSize+1)/2 + RECT_MARGIN*2; //+1 by fontSize is a bit of a kludge

  useEffect(() => setLegendOffset([rectWidth, rectHeight]), []);
  // setLegendOffset(rectWidth);
  return (
      <g transform={`translate(${xPosition}, ${yPosition})`}>
        <foreignObject 
          x={0} 
          y={-rectHeight/2} 
          width= {rectWidth > 0 ? rectWidth : 20}
          height={rectHeight > 0 ? rectHeight : 20} 
          pointerEvents="none"
          // style={fill: 'red'}
        >
          <div 
            // x={0} 
            // y={-rectHeight/2} 
            // width={rectWidth > 0 ? rectWidth : 20 /* protects against negative legend dimensions */} 
            // height={rectHeight > 0 ? rectHeight : 20} 
            style={{
              fill:'rgb(255,0,0)', 
              strokeWidth:2, 
              stroke:'rgb(0,255,0)',
              height: '100%'
            }}>
              🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈
          </div>
        </foreignObject>
        
        

        <text className={'sectionLabel' /* TODO: implement CSS */} 
          x={rectWidth/2 /* Where to put Legend title label */} 
          y={-rectHeight/2 + RECT_MARGIN/2 + 16 /* Where to put Legend title label */} 
          textAnchor={'middle'}
        >
          {legendLabel}
        </text>
        { legend }
      </g>

  )
}