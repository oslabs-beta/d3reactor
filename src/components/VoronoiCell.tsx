import React from 'react';
import {VoronoiProps} from '../../types'


const VoronoiCell = ({fill, stroke, opacity, d} : VoronoiProps) : JSX.Element => {
  return(
    <path fill={fill} stroke={stroke} pointerEvents='all' opacity={opacity} d={d} onMouseOver={() => console.log('hello')}></path>
  )
}
export default VoronoiCell;