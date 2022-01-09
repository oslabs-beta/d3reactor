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
  colorScheme = d3.quantize(d3.interpolateHcl("#9dc8e2", "#07316b"), 8),
  data,
  innerRadius,
  label,
  legend,
  legendLabel,
  outerRadius,
  pieLabel,
  value,
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
  let ratio: number | undefined;
  if (
    typeof outerRadius === "number" &&
    typeof innerRadius === "number" &&
    innerRadius !== 0
  ) {
    ratio = innerRadius / outerRadius;
  }

  outerRadius = outerRadius
    ? checkRadiusDimension(cHeight, cWidth, outerRadius, margin, legend)
    : calculateOuterRadius(cHeight, cWidth, margin);

  if (outerRadius < 20) outerRadius = 20;
  if (ratio) {
    innerRadius = ratio * outerRadius;
  } else if (innerRadius) {
    const checkedRadiusDimension = checkRadiusDimension(
      cHeight,
      cWidth,
      innerRadius,
      margin,
      legend
    );
    innerRadius = checkedRadiusDimension > 0 ? checkedRadiusDimension : 0;
  } else innerRadius = 0;

  type ColorScale = d3.ScaleOrdinal<string, string, never>;

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
  // Position of the legend
  let xPosition = outerRadius + margin.left;
  let yPosition = EXTRA_LEGEND_MARGIN;
  // Offset position of the pie
  let translateX = 0;
  let translateY = 0;
  switch (legend) {
    case "top":
      xPosition = -xOffset / 2 + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case "bottom":
      xPosition = -xOffset / 2 + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 + EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case "left":
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case "top-left":
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius + margin.top + EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case "bottom-left":
      xPosition = -outerRadius - margin.left + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius - margin.bottom - EXTRA_LEGEND_MARGIN;
      translateX = xOffset;
      break;
    case "left-top":
      xPosition = -outerRadius - xOffset + EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case "left-bottom":
      xPosition = -outerRadius - xOffset + EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 + EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case "right-top":
      xPosition = outerRadius - EXTRA_LEGEND_MARGIN;
      yPosition = -outerRadius - margin.top / 2 + EXTRA_LEGEND_MARGIN;
      translateY = yOffset;
      break;
    case "top-right":
      yPosition = -outerRadius + margin.top + EXTRA_LEGEND_MARGIN;
      translateX = -xOffset;
      break;
    case "bottom-right":
      yPosition = outerRadius - margin.bottom - EXTRA_LEGEND_MARGIN;
      translateX = -xOffset;
      break;
    case "right-bottom":
      xPosition = outerRadius - EXTRA_LEGEND_MARGIN;
      yPosition = outerRadius + margin.bottom / 2 + EXTRA_LEGEND_MARGIN;
      translateY = -yOffset;
      break;
    case "right":
    default:
      translateX = -xOffset;
      break;
  }

  const translate = `translate(${(cWidth + translateX) / 2}, ${
    (cHeight + translateY) / 2
  })`;

  return (
    <svg ref={anchor} width={"100%"} height={"100%"}>
      <g transform={translate}>
        {pie.map((d: any, i: number) => (
          <g key={"g" + i}>
            <Arc
              data={{ [label]: d.data[label], [value]: d.data[value] }}
              key={d.label}
              fill={colorScale(keys[i])}
              stroke='#ffffff'
              strokeWidth='0px'
              d={arcGenerator(d)}
              id={"arc-" + i}
              setTooltip={setTooltip}
            />
            {pieLabel && (
              <text
                style={{ pointerEvents: "none" }}
                transform={textTranform(d)}
                textAnchor={"middle"}
                alignmentBaseline={"middle"}
                fill={"black"}
              >
                {d.data[value]}
              </text>
            )}
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
              legendWidth={xOffset}
              legendHeight={yOffset}
              xPosition={xPosition}
              yPosition={yPosition}
              margin={margin}
              cWidth={cWidth / 2}
              cHeight={cHeight / 2}
              EXTRA_LEGEND_MARGIN={EXTRA_LEGEND_MARGIN}
            />
          )
        }
        {tooltip && (
          <Tooltip
            chartType='pie-chart'
            data={tooltip}
            x={tooltip.cx}
            y={tooltip.cy}
            xKey={label}
            yKey={value}
          />
        )}
      </g>
    </svg>
  );
}
