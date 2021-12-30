import React from "react"
import { Circle } from "./Circle"

function Toolti({ x, y }: { x: number; y: number }) {
  const tooltipStyle: React.CSSProperties | undefined = {
    margin: "4px 4px",
    padding: "3px 5px",
    maxHeight: "100%",
    width: "fit-content",
    border: "1px solid $tooltip-border",
    borderRadius: "3px",
    color: "#3f517e",
    // You can also use a fixed width and ommit the white-sapce.
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.3) 0 2px 10px",
  }
  const circleStyle: React.CSSProperties | undefined = {
    opacity: 1,
  }
  return (
    <g>
      <circle
        style={circleStyle}
        cx={x}
        cy={y}
        r={4}
        fill="white"
        stroke="#af9358"
        strokeWidth="2"
      />
      <foreignObject
        x={x}
        y={y}
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <div style={tooltipStyle}>
          <strong>X Position: {x}</strong>
          <br></br>
          <strong>Y Position: {y}</strong>
        </div>
      </foreignObject>
    </g>
  )
}

export const Tooltip = React.memo(Toolti)
