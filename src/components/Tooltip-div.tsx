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
    transform: "translate(-50%, -150%)",
    position: "absolute",
    boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.3)",
    zIndex: "9999",
    pointerEvents:'none',
    background: "white",
    margin: "4px 4px",
    padding: "0.2em .5em",
    borderRadius: "4px",
    color: "#1e2023",
    transition: "all 0.1s ease-out",
  }

  const contentStyle: React.CSSProperties | undefined = {
    maxWidth: "450px",
    position: "absolute",
    transform: "translate(-50%, -150%)",
    boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.3)",

    /* You can also use a fixed width and ommit the white-sapce. */
    // whiteSpace: "nowrap",
    // transform: "translate(calc( -50% + ${x}px), calc(-100% + ${y}px))",
    textAlign: "start",
    lineHeight: "1.5em",
    fontSize: "0.8em",
    zIndex: "9999",
  }



  const xTooltipText: string = `${xKey}: ${data.tooltipData[xKey as string]}`
  const yTooltipText: string = `${yKey}: ${data.tooltipData[yKey as string]}`

  return (
    <div style={tooltipStyle}>
        {xTooltipText}
        <br />
        {yTooltipText}

    </div>
  )
}

export default TooltipDiv
