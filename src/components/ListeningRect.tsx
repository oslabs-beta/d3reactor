import React from "react"

interface Margin {
  left: number
  right: number
  top: number
  bottom: number
}
export default function ListeningRect({
  width,
  height,
  margin,
}: {
  width: number
  height: number
  margin: Margin
}) {
  return (
    <rect
      width={width - margin.right - margin.left}
      height={height - margin.bottom - margin.top}
      fill="transparent"
      onMouseMove={() => console.log("Listening")}
    />
  )
}
