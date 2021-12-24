import React from "react"

 function Toolti({ x, y }: { x: number; y: number }) {
  const style: React.CSSProperties | undefined = {
    margin: "4px 4px",
    padding: "3px 5px",
    maxWidth: "200px",
    maxHeight: "100px",
    border: "1px solid $tooltip-border",
    borderRadius: "3px",
    color: "#3f517e",
    // You can also use a fixed width and ommit the white-sapce.
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.3) 0 2px 10px",
  }
  return (
    <foreignObject x={x} y={y} width={150} height={75} pointerEvents="none"
>

      <div style={style}>
        <strong>X Position: {x}</strong>
        <br></br>
        <strong>Y Position: {y}</strong>
      </div>
    </foreignObject>
  )
}

export const Tooltip = React.memo(Toolti)