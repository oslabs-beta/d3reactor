import React from "react"
import { RectangleProps } from "../../types"

export const Rectangle = React.memo(
  ({
    data,
    x,
    y,
    width,
    height,
    fill,
    setTooltip,
  }: RectangleProps): JSX.Element => {
    let cellCenter = { cx: x, cy: y, tooltipData: data }
    if (typeof x === "number" && typeof y === "number") {
      const cx = x + width / 2
      const cy = y - 50
    }

    // console.log("Tooltip data ", data)
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseOver={(e) => {
          setTooltip ? setTooltip(cellCenter) : null
        }}
        onMouseOut={() => (setTooltip ? setTooltip(false) : null)}
      />
    )
  }
)
