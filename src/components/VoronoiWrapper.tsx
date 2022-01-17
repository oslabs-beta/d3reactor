import React from "react"
import { Data, VoronoiBody } from "../../types"
import { VoronoiCell } from "./VoronoiCell"

export const VoronoiWrapper = React.memo(
  ({
    data,
    voronoi,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    setTooltip,
  }: VoronoiBody): JSX.Element => {
    return (
      <g className="voronoi-wrapper">
        {data.map((element: Data, i: number) => (
          <VoronoiCell
            key={i}
            fill="none"
            stroke="none"
            opacity={0.5}
            d={voronoi.renderCell(i)}
            cellCenter={{
              cx: xScale(xAccessor(element)),
              cy: yScale(yAccessor(element)),
              tooltipData: element,
            }}
            setTooltip={setTooltip}
            data={element}
          />
        ))}
      </g>
    )
  }
)
