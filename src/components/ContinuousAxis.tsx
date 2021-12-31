import React, { useMemo } from "react";
import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
import { ContinuousAxisProps } from "../../types";
import { getAxisLabelCoordinates } from "../utils";

function Axi({
  x,
  y,
  scale,
  type,
  label,
  width,
  height,
  margin,
  xGrid,
  yGrid,
  xTicksValue,
}: ContinuousAxisProps): JSX.Element {
  const gRef = useD3(
    (anchor) => {
      let axis: d3.Axis<d3.NumberValue>;

      switch (type) {
        case "bottom":
          axis = d3.axisBottom(scale);
          break;
        case "top":
          axis = d3.axisTop(scale);
          break;
        case "left":
          axis = d3.axisLeft(scale);
          break;
        case "right":
          axis = d3.axisRight(scale);
          break;
        default:
          axis = d3.axisRight(scale);
          break;
      }

      anchor.call(axis);
    },
    [type, scale]
  );

  const { axisLabelX, axisLabelY, rotate } = useMemo(
    () => getAxisLabelCoordinates(x, y, height, width, margin, type),
    [x, y, width, height, margin, type]
  );

  let grid: JSX.Element[] = [];
  switch (true) {
    case type === "bottom" && xGrid:
      grid = (xTicksValue ? xTicksValue : scale.ticks()).map(
        (tick: any, i: number) => (
          <line
            key={i}
            x1={scale(tick)}
            x2={scale(tick)}
            y1={0}
            y2={-height + margin.bottom + margin.top}
            strokeOpacity="0.2"
            stroke="currentColor"
          ></line>
        )
      );
      break;
    case type === "top" && xGrid:
      grid = (xTicksValue ? xTicksValue : scale.ticks()).map(
        (tick: any, i: number) => (
          <line
            key={i}
            x1={scale(tick)}
            x2={scale(tick)}
            y1={0}
            y2={height - margin.bottom - margin.top}
            strokeOpacity="0.2"
            stroke="currentColor"
          ></line>
        )
      );
      break;
    case type === "left" && yGrid:
      grid = scale
        .ticks()
        .map((tick: any, i: number) => (
          <line
            key={i}
            x1={0}
            x2={width - margin.right - margin.left}
            y1={scale(tick)}
            y2={scale(tick)}
            strokeOpacity="0.2"
            stroke="currentColor"
          ></line>
        ));
      break;
    case type === "right" && yGrid:
      grid = scale
        .ticks()
        .map((tick: any, i: number) => (
          <line
            key={i}
            x1={0}
            x2={-(width - margin.right - margin.left)}
            y1={scale(tick)}
            y2={scale(tick)}
            strokeOpacity="0.2"
            stroke="currentColor"
          ></line>
        ));

      break;
  }

  return (
    <g>
      <g ref={gRef} transform={`translate(${x}, ${y})`}>
        {grid}
      </g>
      <text
        transform={`translate(${axisLabelX}, ${axisLabelY}) rotate(${rotate})`}
        textAnchor="middle"
      >
        {label}
      </text>
      ;
    </g>
  );
}

function AxisPropsAreEqual(
  prevAxis: ContinuousAxisProps,
  newAxis: ContinuousAxisProps
) {
  return (
    prevAxis.scale === newAxis.scale &&
    prevAxis.height === newAxis.height &&
    prevAxis.width === newAxis.width
  );
}

export const Axis = React.memo(Axi, AxisPropsAreEqual);
