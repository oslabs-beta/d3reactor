import React from 'react';
import * as d3 from 'd3';
import {Data, ScaleFunc, xAccessorFunc, yAccessorFunc, VoronoiBody} from '../../types';
import { VoronoiCell } from './VoronoiCell';

const VoronoiBody = ({data, voronoi, xScale, yScale, xAccessor, yAccessor, setTooltip} : VoronoiBody):JSX.Element  => {
  return (
    <g className="voronoi-wrapper">
    {data.map((element: Data, i: number) => (
      <VoronoiCell
        key={i}
        fill="none"
        stroke="#ff1493"
        opacity={0.5}
        d={voronoi.renderCell(i)}
        cellCenter={{
          cx: xScale(xAccessor(element)),
          cy: yScale(yAccessor(element)),
        }}
        setTooltip={setTooltip}
        data = {element}
      />
    ))}
  </g>  )

}

function voronoiPropsAreEqual (prevVoronoi:any, newVoronoi:any) {
  return prevVoronoi.data === newVoronoi.data && prevVoronoi.voronoi === newVoronoi.voronoi
}

export const VoronoiWrapper = React.memo(VoronoiBody, voronoiPropsAreEqual);