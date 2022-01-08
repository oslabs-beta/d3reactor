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
  const tooltipStyle: React.CSSProperties | undefined = {
    left: x,
    top: y,
    transform: "translateX(-50%, -50%)",
    position: "absolute",
    boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.3)",
    zIndex: "9999",
  }

  const contentStyle: React.CSSProperties | undefined = {
    maxWidth: "450px",
    position: "absolute",
    transform: "translate(-50%, -75px)",
    background: "white",
    boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.3)",

    margin: "4px 4px",
    padding: "0.2em .5em",
    borderRadius: "4px",
    color: "#1e2023",
    /* You can also use a fixed width and ommit the white-sapce. */
    // whiteSpace: "nowrap",
    // transform: "translate(calc( -50% + ${x}px), calc(-100% + ${y}px))",
    textAlign: "start",
    lineHeight: "1.5em",
    fontSize: "0.8em",
    zIndex: "9999",
    transition: "all 0.1s ease-out",
  }

  const triangleWrapperStyle: React.CSSProperties | undefined = {
    position: "absolute",
    width: "50px",
    height: "25px",
    transform: "translateY(-50%) rotate(45deg)",
    overflow: "hidden",
  }

  const triangleStyle: React.CSSProperties | undefined = {
    content: "",
    position: "absolute",
    width: "20px",
    height: "20px",
    background: "white",
    // transform: "translateX(-50%, -50%) rotate(45deg)",
    boxShadow: "1px 1px 20px 0px rgba(0,0,0,0.6)",
  }

  const circleStyle: React.CSSProperties | undefined = {
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    position: "absolute",
    transform: "translateX(-10px, -10px)",
    backgroundColor: "black",
  }

  console.log("x, y", x, y)
  const xTooltipText: string = `${xKey}: ${data.tooltipData[xKey as string]}`
  const yTooltipText: string = `${yKey}: ${data.tooltipData[yKey as string]}`

  return (
    <div style={tooltipStyle}>
      <div style={contentStyle}>
        {xTooltipText}
        <br />
        {yTooltipText}
      </div>
      <div style={triangleWrapperStyle}>
        <div style={triangleStyle}></div>
      </div>
      <div style={circleStyle}></div>
    </div>
  )
}

export default TooltipDiv
