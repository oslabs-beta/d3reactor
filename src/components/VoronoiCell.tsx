import React from "react"
import { VoronoiProps } from "../../types"

export const VoronoiCell = ({
  fill,
  stroke,
  opacity,
  d,
  cellCenter,
  setTooltip,
  data,
}: VoronoiProps): JSX.Element => {
  // console.log('cell rerendered')
  return (
    <path
      fill={fill}
      stroke={stroke}
      pointerEvents="all"
      opacity={opacity}
      d={d}
      onMouseOver={(e) => {
        setTooltip ? setTooltip(cellCenter) : null
      }}
      onMouseOut={() => (setTooltip ? setTooltip(false) : null)}
    ></path>
  )
}
