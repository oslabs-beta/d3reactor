import React from 'react';

interface VoronoiProps {
  fill: string
  stroke: string
  opacity: number
  d: string | undefined
}

const VoronoiCell = ({fill, stroke, opacity, d} : VoronoiProps) : JSX.Element => {
  return(
    <path fill={fill} stroke={stroke} pointerEvents='all' opacity={opacity} d={d} onMouseOver={() => console.log('hello')}></path>
  )
}
export default VoronoiCell;