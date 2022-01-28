import React from 'react';
import { Data, VoronoiBody } from '../../types';
import { VoronoiCell } from './VoronoiCell';
import useWindowDimensions from '../hooks/useWindowDimensions';

export const VoronoiWrapper = React.memo(
  ({
    data,
    voronoi,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    setTooltip,
    margin,
  }: VoronoiBody): JSX.Element => {
    const { width, height } = useWindowDimensions();
    return (
      <g className="voronoi-wrapper">
        {data.map((element: Data, i: number) => (
          <VoronoiCell
            key={JSON.stringify(element)}
            fill="none"
            stroke="none"
            opacity={0.5}
            d={voronoi.renderCell(i)}
            cellCenter={{
              cx: xScale(xAccessor(element)),
              cy: yScale(yAccessor(element)),
              tooltipData: element,
            }}
            margin={margin}
            setTooltip={setTooltip}
            data={element}
          />
        ))}
      </g>
    );
  }
);
