import React from "react"
import { useResponsive } from "../hooks/useResponsive"
import { TooltipProps } from "../../types"

// import "./Tooltip.css"

function MemTooltip({
  data,
  xAccessor,
  yAccessor,
  x,
  y,
  xKey,
  yKey,
}: TooltipProps) {
  // const { anchor, cHeight, cWidth } = useResponsive()

  const tooltipStyle: React.CSSProperties | undefined = {
    margin: "4px 4px",
    padding: "0.2em .5em",
    width: "140",
    maxHeight: "28",
    borderRadius: "4px",
    color: "#3f517e",
    /* You can also use a fixed width and ommit the white-sapce. */
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    // transform: "translate(calc( -50% + ${x}px), calc(-100% + ${y}px))",
    textAlign: "start",
    lineHeight: "1.4em",
    fontSize: "0.9em",
    zIndex: "10",
    transition: "all 0.1s ease-out",
  }

  const circleStyle: React.CSSProperties | undefined = {
    opacity: 1,
  }

  const triangleStyle: React.CSSProperties | undefined = {
    fill: "#fff",
  }

  const verticalOffset: number = -6

  // console.log("X ", x)
  // console.log("Y ", y)
  // console.log("Anchor ", anchor)
  // console.log("cHeight ", cHeight)
  // console.log("DATA ", data)
  const getMaxStringLength = (xString: string, yString: string): number => {
    const xLength: number = xString.length
    const yLength: number = yString.length
    return Math.max(xLength, yLength)
  }

  console.log("x String ", `${xKey}: ${data.tooltipData[xKey as string]}`)
  const xTooltipText: string = `${xKey}: ${data.tooltipData[xKey as string]}`
  const yTooltipText: string = `${yKey}: ${data.tooltipData[yKey as string]}`

  const CHAR_WIDTH = 9
  const tooltipWidth: number =
    getMaxStringLength(xTooltipText, yTooltipText) * CHAR_WIDTH
  const LINE_HEIGHT = 30
  const tooltipHeight: number = LINE_HEIGHT * 2
  console.log("tt width ", tooltipWidth)
  // console.log("cWidth ", cWidth)
  return (
    <g>
      <circle
        style={circleStyle}
        cx={x}
        cy={y}
        r={4}
        fill="white"
        stroke="#7ba2bf"
        strokeWidth="2"
      />
      <polygon
        style={triangleStyle}
        points={`
        ${x},${y + verticalOffset}
        ${x - 10},${y + verticalOffset - 12}
        ${x + 10},${y + verticalOffset - 12}`}
      />
      <foreignObject
        x={x - tooltipWidth / 2}
        y={y + verticalOffset - tooltipHeight}
        width={tooltipWidth}
        height={tooltipHeight}
        pointerEvents="none"
      >
        <div style={tooltipStyle}>
          <strong>
            {xKey}: {data.tooltipData[xKey as string]}
          </strong>
          <br></br>
          <strong>
            {yKey}: {Math.round(data.tooltipData[yKey as string] * 100) / 100}
          </strong>
        </div>
      </foreignObject>
    </g>
  )
}

export const Tooltip = React.memo(MemTooltip)
