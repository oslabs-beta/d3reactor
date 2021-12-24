import React from 'react';
import {CircleProps} from '../../types'

const CircleBody = ({cx, cy, r=4, color}: CircleProps):JSX.Element => {
  console.log('circle rerendered')
  return (
    <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={1.4}/>
  )
}

export const Circle = React.memo(CircleBody)