import React from "react"
import { VoronoiProps } from "../../types"

const VoronoiCell = ({
  fill,
  stroke,
  opacity,
  d,
  cellCenter,
  setTooltip,
  data
}: VoronoiProps): JSX.Element => {
  // console.log("Cell center ", cellCenter)
  return (
    <path
      fill={fill}
      stroke={stroke}
      pointerEvents="all"
      opacity={opacity}
      d={d}
      onMouseOver={(e) => {console.log(data);setTooltip ? setTooltip(cellCenter) : null}}
      onMouseOut={() => (setTooltip ? setTooltip(false) : null)}
    ></path>
  )
}
export default VoronoiCell
