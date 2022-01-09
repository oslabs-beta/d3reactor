import React from "react"
import { useResponsive } from "../hooks/useResponsive"
import { TooltipProps } from "../../types"

function MemTooltip({
  chartType,
  data,
  xAccessor,
  yAccessor,
  x,
  y,
  xKey,
  yKey,
}: TooltipProps) {
  const tooltipStyle: React.CSSProperties | undefined = {
    margin: "4px 4px",
    padding: "0.2em .5em",
    borderRadius: "4px",
    color: "#1e2023",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    textAlign: "start",
    lineHeight: "1.5em",
    fontSize: "0.8em",
    zIndex: "9999",
    transition: "all 0.1s ease-out",
  }

  const circleStyle: React.CSSProperties | undefined = {
    opacity: 1,
  }

  const triangleStyle: React.CSSProperties | undefined = {
    fill: "#fff",
  }

  const VERTICAL_OFFSET: number = -4
  const getMaxStringLength = (xString: string, yString: string): number => {
    const xLength: number = xString.length
    const yLength: number = yString.length
    return Math.max(xLength, yLength)
  }

  const xTooltipText: string = `${xKey}: ${data.tooltipData[xKey as string]}`
  const yTooltipText: string = `${yKey}: ${data.tooltipData[yKey as string]}`

  const CHAR_WIDTH = 9
  const tooltipWidth: number =
    getMaxStringLength(xTooltipText, yTooltipText) * CHAR_WIDTH
  const LINE_HEIGHT = 30
  const tooltipHeight: number = LINE_HEIGHT * 2
  return (
    <g>
      {chartType !== "pie-chart" ? (
        <circle
          style={circleStyle}
          cx={x}
          cy={y}
          r={4}
          fill="white"
          stroke="#7ba2bf"
          strokeWidth="2"
          pointerEvents="none"
        />
      ) : null}
      <polygon
        style={triangleStyle}
        points={`
        ${x},${y + VERTICAL_OFFSET}
        ${x - 10},${y + VERTICAL_OFFSET - 10}
        ${x + 10},${y + VERTICAL_OFFSET - 10}`}
        pointerEvents="none"
      />
      <foreignObject
        x={x - tooltipWidth / 2}
        y={y - tooltipHeight}
        width={tooltipWidth}
        height={tooltipHeight}
        pointerEvents="none"
      >
        <div style={tooltipStyle}>
          {xTooltipText}
          <br></br>
          {yTooltipText}
        </div>
      </foreignObject>
    </g>
  )
}

export const Tooltip = React.memo(MemTooltip)
