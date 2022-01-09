import React from "react"
import { TooltipProps } from "../../types"

const TooltipDiv = ({
  chartType,
  data,
  xAccessor,
  yAccessor,
  x,
  y,
  xKey,
  yKey,
}: TooltipProps): JSX.Element => {
  const tooltipWrapperStyle: React.CSSProperties | undefined = {
    left: x,
    top: y,
    transform: "translate(-50%, -50%)",
    position: "absolute",
    pointerEvents: "none",
  }

  const backgroundColor = "#fff"
  const boarderColor = "#ddd"
  const pointerSize = 12

  const contentStyle: React.CSSProperties | undefined = {
    // opacity: 0.2,
    position: "absolute",
    margin: "4px 4px",
    padding: "0.6em 1em",
    borderRadius: "4px",
    maxWidth: "280px",
    transform: `translate(-50%, calc(-100% - ${pointerSize + 4}px)`,
    // background: "#fff",
    background: backgroundColor,
    textAlign: "center",
    lineHeight: "1.4em",
    fontSize: "0.9em",
    color: "#1e2023",
    border: `1px solid ${boarderColor}`,
    zIndex: "9",
    transition: "all 0.1s ease-out",
    boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.3)",
  }

  const triangleStyle: React.CSSProperties | undefined = {
    content: "",
    position: "absolute",
    width: `${pointerSize}px`,
    height: `${pointerSize}px`,
    background: backgroundColor,
    transform: `translate(-50%, calc(-102% - ${
      pointerSize / 2
    }px)) rotate(45deg)`,
    zIndex: "10",
  }

  const triangleBorderStyle: React.CSSProperties | undefined = {
    content: "",
    position: "absolute",
    width: `${pointerSize}px`,
    height: `${pointerSize}px`,
    background: boarderColor,
    transform: `translate(-50%, calc(-100% - ${
      pointerSize / 2
    }px)) rotate(45deg)`,
    boxShadow: "1px 1px 20px 0px rgba(0,0,0,0.6)",
    zIndex: "8",
  }

  const circleStyle: React.CSSProperties | undefined = {
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    position: "absolute",
    transform: "translateX(-10px, -10px)",
    backgroundColor: "black",
  }

  const xTooltipText: string = `${xKey}: ${data.tooltipData[xKey as string]}`
  const yTooltipText: string = `${yKey}: ${data.tooltipData[yKey as string]}`

  return (
    <div style={tooltipWrapperStyle}>
      <div style={contentStyle}>
        {xTooltipText}
        <br />
        {yTooltipText}
      </div>
      <div style={triangleStyle}></div>
      <div style={triangleBorderStyle}></div>
      {chartType !== "scatter-plot" && <div style={circleStyle}></div>}
    </div>
  )
}

export default TooltipDiv
