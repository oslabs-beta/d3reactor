import React from 'react';
import * as d3 from 'd3';
import { Margin} from "../../types"


export function gridGenerator (type: 'top' | 'bottom' | 'left' | 'right', xGrid: boolean | undefined, yGrid: boolean | undefined, xTicksValue:(number | Date | undefined)[], scale:d3.ScaleLinear<number, number, never> | d3.ScaleTime<number, number, never>, height: number, width: number, margin: Margin): JSX.Element[] {
let grid: JSX.Element[]  = []
switch (true) {
  case type === "bottom" && xGrid:
    grid = (xTicksValue ? xTicksValue : scale.ticks())
            .map((tick:any, i:number) => (
        <line
          key={i}
          x1={scale(tick)}
          x2={scale(tick)}
          y1={0}
          y2={-height + margin.bottom + margin.top}
          strokeOpacity="0.2"
          stroke="#bdc3c7"
        />
      ))
    break
  case type === "top" && xGrid:
    grid = (xTicksValue ? xTicksValue : scale.ticks())
      .map((tick:any, i:number) => (
        <line
          key={i}
          x1={scale(tick)}
          x2={scale(tick)}
          y1={0}
          y2={height - margin.bottom - margin.top}
          strokeOpacity="0.2"
          stroke="#bdc3c7"
          />        
        ))   
    break
  case type === "left" && yGrid:
    grid = (xTicksValue ? xTicksValue : scale.ticks())
            .map((tick:any, i:number) => (
        <line
          key={i}
          x1={0}
          x2={width - margin.right - margin.left}
          y1={scale(tick)}
          y2={scale(tick)}
          strokeOpacity="0.2"
          stroke="#bdc3c7"
        />        
))
    break
  case type === "right" && yGrid :
    grid = (xTicksValue ? xTicksValue : scale.ticks())
          .map((tick:any, i:number) => (
        <line
          key={i}
          x1={0}
          x2={-(width - margin.right - margin.left)}
          y1={scale(tick)}
          y2={scale(tick)}
          strokeOpacity="0.2"
          stroke="#bdc3c7"
        />
      ))

    break
}
return grid
}