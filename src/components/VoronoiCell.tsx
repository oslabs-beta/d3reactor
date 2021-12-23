import React from "react"
import { VoronoiProps } from "../../types"

const VoronoiCell = ({
  fill,
  stroke,
  opacity,
  d,
  cellCenter,
  setTooltip,
}: VoronoiProps): JSX.Element => {
  return (
    <path
      fill={fill}
      stroke={stroke}
      pointerEvents="all"
      opacity={opacity}
      d={d}
      onMouseOver={(e) => (setTooltip ? setTooltip(cellCenter) : null)}
      onMouseOut={() => (setTooltip ? setTooltip(false) : null)}
    ></path>
  )
}
export default VoronoiCell
