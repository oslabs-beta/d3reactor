import React from "react"
import * as d3 from "d3"

export default function AreaChartTest({ data }: any) {
  const width = 600
  const height = 400

  const fruit: any = [
    {
      date: "Thu Feb 01 2018 00:00:00 GMT-0500 (Eastern Standard Time)",
      apples: 10,
      bananas: 20,
      oranges: 15,
    },
    {
      date: "Thu Mar 01 2018 00:00:00 GMT-0500 (Eastern Standard Time)",
      apples: 15,
      bananas: 15,
      oranges: 15,
    },
    {
      date: "Sun Apr 01 2018 00:00:00 GMT-0400 (Eastern Daylight Time)",
      apples: 20,
      bananas: 25,
      oranges: 15,
    },
  ]

  const stack = d3.stack().keys(["apples", "bananas", "oranges"])
  const layers = stack(fruit)
  console.log(layers)

  const extent = [
    0,
    d3.max(layers, (layer) => d3.max(layer, (sequence: any) => sequence[1])),
  ]

  console.log("EXTENT ", extent)

  const xAccessor = (d: any) => new Date(d.date)
  const xMin = d3.extent(data, xAccessor)[0]
  const xMax = d3.extent(data, xAccessor)[1]
  const xScale = d3
    .scaleTime()
    .domain([xMin ?? 0, xMax ?? 0])
    .range([0, width])

  const yAccessor = (d: any) => d
  const yMin = 0
  const yMax = extent[1]
  const yScale = d3
    .scaleLinear()
    .domain([yMin ?? 0, yMax ?? 0])
    .range([height, 0])

  const areaGenerator: any = d3
    .area()
    .x((sequence: any) => xScale(xAccessor(sequence.data)))
    .y0((sequence) => yScale(sequence[0]))
    .y1((sequence) => yScale(sequence[1]))

  layers.map((layer) => console.log(areaGenerator(layer)))

  // const yMin = d3.extent(data, yAccessor)[0]
  // const yMax = findYDomainMax(data, keys)
  // const yScale = d3
  //   .scaleLinear()
  //   .domain([yMin ?? 0, yMax ?? 0])
  //   .range([height - margin.top - margin.bottom, 0])
  //   .nice()

  // console.log("Area ", area(data))
  return (
    <svg width={width} height={height}>
      <g transform="translate(-1040px, -32px)">
        {layers.map((layer) => (
          <path d={areaGenerator(layer)} />
        ))}
      </g>
    </svg>
  )
}
