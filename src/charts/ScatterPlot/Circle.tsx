import React from "react";

import {CircleProps} from '../../../types'

const Circle = ({cx, cy, r=4, color}: CircleProps):JSX.Element => {
  return (
    <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={1.4}/>
  )
}

export default Circle;