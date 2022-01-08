import React from 'react';
import { TooltipProps } from "../../types"


const TooltipDiv = ({
  chartType,
  data,
  xAccessor,
  yAccessor,
  x,
  y,
  xKey,
  yKey,
}: TooltipProps): JSX.Element => {


  console.log('x, y', x, y)
  return (
    <div className="tooltip" style={{position:"absolute"}}>
    {x}:{y}
    </div>
  )
}

export default TooltipDiv;