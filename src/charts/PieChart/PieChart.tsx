/** App.js */
import React, { useState, useMemo } from "react";
import * as d3 from "d3";
import { useResponsive } from "../../hooks/useResponsive";
import { PieChartProps } from "../../../types";
import { ColorLegend } from "../../components/ColorLegend";
import { Arc } from "../../components/Arc";
import { Tooltip } from "../../components/Tooltip";
import {
  checkRadiusDimension,
  calculateOuterRadius,
  getMarginsWithLegend,
  EXTRA_LEGEND_MARGIN,
} from "../../utils";

export default function PieChart({
  data,
  label,
  value,
  outerRadius,
  innerRadius,
  legend,
  legendLabel,
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
}: PieChartProps): JSX.Element {
  const [tooltip, setTooltip] = useState<false | any>(false);

  const { anchor, cHeight, cWidth } = useResponsive();

  // width & height of legend, so we know how much to squeeze chart by
  const [legendOffset, setLegendOffset] = useState<[number, number]>([0, 0]);
  const xOffset = legendOffset[0];
  const yOffset = legendOffset[1];
  const margin = useMemo(
    () =>
      getMarginsWithLegend(
        false,
        false,
        undefined,
        undefined,
        legend,
        xOffset,
        yOffset,
        cWidth,
        cHeight
      ),
    [legend, xOffset, yOffset, cWidth, cHeight]
  );
  outerRadius = outerRadius
    ? checkRadiusDimension(cHeight, cWidth, outerRadius, margin)
    : calculateOuterRadius(cHeight, cWidth, margin);
  innerRadius = innerRadius
    ? checkRadiusDimension(outerRadius, outerRadius, innerRadius, margin)
    : 0;
  type ColorScale = d3.ScaleOrdinal<string, string, never>;

  // const getTranslateX = (legendPos: string) => {
  //   if (legendPos.includes("left")) {
  //     return cWidth / 2 + margin.left;
  //   } else if (legendPos.includes("right")) {
  //     return cWidth / 2 - margin.right;
  //   } else return cWidth / 2;
  // };
  // const getTranslateY = (legendPos: string) => {
  //   if (legendPos.includes("bottom")) {
  //     return cHeight / 2 - margin.bottom;
  //   } else if (legendPos.includes("top")) {
  //     return cHeight / 2 + margin.top;
  //   } else return cHeight / 2;
  // };

  const translate = `translate(${cWidth / 2}, ${cHeight / 2})`;

  const keys: string[] = [];
  for (let entry of data) {
    const property = entry[label];
    if (property && !keys.includes(property)) {
      keys.push(property);
    }
  }

  const colorScale: ColorScale = d3.scaleOrdinal(colorScheme);
  colorScale.domain(keys);

  const arcGenerator: any = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const pieGenerator: any = d3
    .pie()
    .padAngle(0)
    .value((d: any) => d[value]);

  const pie: any = pieGenerator(data);

  const textTranform = (d: any) => {
    const [x, y] = arcGenerator.centroid(d);
    return `translate(${x}, ${y})`;
  };

  return (
    <svg ref={anchor} width={"100%"} height={"100%"}>
      <g transform={translate}>
        {pie.map((d: any, i: number) => (
          <g key={"g" + i}>
            <Arc
              key={d.label}
              fill={colorScale(keys[i])}
              stroke="#ffffff"
              strokeWidth="0px"
              d={arcGenerator(d)}
              id={"arc-" + i}
              setTooltip={setTooltip}
            />
            <text
              style={{ pointerEvents: "none" }}
              transform={textTranform(d)}
              textAnchor={"middle"}
              alignmentBaseline={"middle"}
              fill={"black"}
            >
              {d.data[value]}
            </text>
          </g>
        ))}

        {
          // If legend prop is truthy, render legend component:
          legend && (
            <ColorLegend
              legendLabel={legendLabel}
              circleRadius={5 /* Radius of each color swab in legend */}
              colorScale={colorScale}
              setLegendOffset={setLegendOffset}
              legendPosition={legend}
              xOffset={xOffset}
              yOffset={yOffset}
              margin={margin}
              cWidth={cWidth / 2}
              cHeight={cHeight / 2}
              EXTRA_LEGEND_MARGIN={EXTRA_LEGEND_MARGIN}
              isPie={true}
              outerRadius={outerRadius}
            />
          )
        }
        {tooltip && <Tooltip x={tooltip.cx} y={tooltip.cy} />}
      </g>
    </svg>
  );
}
