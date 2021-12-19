/** App.js */
import React, {useMemo} from "react";
import * as d3 from "d3"
import { useResponsive } from '../../hooks/useResponsive';
import Axis from "../../components/ContinuousAxis"
import Circle from "../../components/Circle"
import { d3Voronoi } from '../../functionality/voronoi';
import { xScaleDef } from '../../functionality/xScale';
import { yScaleDef } from '../../functionality/yScale';
import VoronoiCell from "../../components/VoronoiCell";
import { ScatterProps, Data, AccessorFunc, ColorScale } from "../../../types"
import {
  getXAxisCoordinates,
  getYAxisCoordinates,
  getMargins,
  inferXDataType,
} from "../../utils";


export default function ScatterPlot({
  data,
  height = "100%",
  width = "100%",
  xKey,
  xDataType,
  yKey,
  groupBy,
  xAxis = "bottom",
  yAxis = "left",
  xGrid = false,
  yGrid = false,
  xAxisLabel,
  yAxisLabel,
  colorScheme = d3.schemeCategory10,
}: ScatterProps<string | number>): JSX.Element {
  
const {anchor, cHeight, cWidth}  = useResponsive();

const margin = useMemo(
  () => getMargins(xAxis, yAxis, xAxisLabel, yAxisLabel),
  [xAxis, yAxis, xAxisLabel, yAxisLabel]
)

const { xAxisX, xAxisY } = useMemo(
  () => getXAxisCoordinates(xAxis, cHeight, margin),
  [cHeight, xAxis, margin]
)

const { yAxisX, yAxisY } = useMemo(
  () => getYAxisCoordinates(yAxis, cWidth, margin),
  [cWidth, yAxis, margin]
)

const translate = `translate(${margin.left}, ${margin.top})`

if (!xDataType) {
  xDataType = inferXDataType(data[0], xKey);
}

let keys: string[] = [],
  groups: d3.InternMap<any, any[]>
const groupAccessor = (d: any) => d[groupBy ?? ""]
groups = d3.group(data, groupAccessor)
keys = Array.from(groups).map((group) => group[0])


const xAccessor: AccessorFunc = xDataType === 'number' ? (d) => d[xKey] : (d) => new Date(d[xKey]);
const yAccessor: AccessorFunc = (d) => d[yKey];

const xScale = xScaleDef(data, xDataType, xAccessor, margin, cWidth);
const yScale = yScaleDef(data, margin, cHeight, yAccessor);

const voronoi = d3Voronoi(data, xScale, yScale, xAccessor, yAccessor, cHeight, cWidth, margin)

const colorScale: ColorScale = d3.scaleOrdinal(colorScheme)
colorScale.domain(keys)

  return (
    <svg ref={anchor} width={width} height={height}>
       <g className="spbody" transform={translate}>
      {yAxis && (
        <Axis
          x={yAxisX}
          y={yAxisY}
          yGrid={yGrid}
          height={cHeight}
          width={cWidth}
          margin={margin}
          scale={yScale}
          type={yAxis}
          label={yAxisLabel}
        />
      )}
      {xAxis && (
        <Axis
          x={xAxisX}
          y={xAxisY}
          xGrid={xGrid}
          height={cHeight}
          width={cWidth}
          margin={margin}
          scale={xScale}
          type={xAxis}
          label={xAxisLabel}
        />
      )}
      {data.map((element: any, i: number) =>
        !groupBy ? (
          <Circle
            key={i}
            cx={xScale(xAccessor(element))}
            cy={yScale(yAccessor(element))}
            r={5}
            color="steelblue"
          />
        ) : (
          <Circle
            key={i}
            cx={xScale(xAccessor(element))}
            cy={yScale(yAccessor(element))}
            r={5}
            color={colorScale(element[groupBy])}
          />
        )
      )}
      {voronoi && (
        <g className="voronoi-wrapper">
          {data.map((_elem: Data, i: number) => (
            <VoronoiCell key={i} fill='none' stroke="#ff1493" opacity={0.5} d={voronoi.renderCell(i)}/>
          ))}
        </g>
      )}
    </g>
    </svg>
  )
}
