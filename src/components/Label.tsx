import React, {useMemo} from 'react';
import { getAxisLabelCoordinates } from '../utils';
import { Margin } from '../../types';


export function Label ({x, y, height, width, margin, type, axis, label}: {x:number, y: number, height: number, width: number, margin: Margin, type:string, axis: boolean, label: string}): JSX.Element {

  const { axisLabelX, axisLabelY, rotate } = useMemo(
    () => getAxisLabelCoordinates(x, y, height, width, margin, type, axis),
    [x, y, width, height, margin, type, axis]
  )

return (
  <text
  transform={`translate(${axisLabelX}, ${axisLabelY}) rotate(${rotate})`}
  textAnchor="middle"
>
  {label}
  </text>
)
}
