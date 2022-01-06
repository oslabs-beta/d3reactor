import React from "react"
import { LineProps } from "../../types"

export const Line = React.memo(
  ({
    fill = "none",
    stroke,
    strokeWidth = "1px",
    d,
  }: LineProps): JSX.Element => {
    // console.log('Line rendered')
    return (
      <path
        className="line"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d={d}
      />
    )
  }
)
