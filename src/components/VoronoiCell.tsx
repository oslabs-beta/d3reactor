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
  console.log('rerendered')
  return (
    <path
      fill={fill}
      stroke={stroke}
      pointerEvents="all"
      opacity={opacity}
      d={d}
      onMouseOver={(e) => {
        // console.log('e', e.nativeEvent.clientY)
        if (cellCenter) {
          console.log('cc before', cellCenter)

          cellCenter.cy = e.nativeEvent.pageY - e.nativeEvent.offsetY + cellCenter.cy
          cellCenter.cx = e.nativeEvent.pageX - e.nativeEvent.offsetX + cellCenter.cx

          console.log(cellCenter)

        }


        setTooltip ? setTooltip(cellCenter) : null
      }}
      onMouseOut={(e) => {
        if (cellCenter) {
          cellCenter.cy = cellCenter.cy - e.nativeEvent.pageY + e.nativeEvent.offsetY
          cellCenter.cx = cellCenter.cx - e.nativeEvent.pageX + e.nativeEvent.offsetX

        };
        setTooltip ? setTooltip(false) : null}}
    ></path>
  )
}
