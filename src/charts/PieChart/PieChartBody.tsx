/** LineChart.js */
import React, { useMemo } from "react"
import * as d3 from "d3"
import { PieChartBodyProps } from "../../../types"
import {
  getMargins,
} from "../../utils"

type AccessorFunc = (d: any) => any // number | Date | string
type Domain = any //number | Date | undefined
type ContinuousScaleFunc =
  | d3.ScaleLinear<number, number, never>
  | d3.ScaleTime<number, number, never>
type DiscreteScaleFunc = d3.ScaleBand<string>

const PieChartBody = ({
  data,
  outerRadius,
  innerRadius,
  height, 
  width
}: PieChartBodyProps<number>): JSX.Element => {
 
  const colors = [
    "#f7fcfd",
    "#f6fbfd",
    "#f6fbfc",
    "#f5fafc",
    "#f4fafc",
    "#f3f9fc",
    "#f3f9fb",
    "#f2f8fb",
    "#f1f8fb",
    "#f0f7fa",
    "#f0f7fa",
    "#eff6fa",
    "#eef6fa",
    "#eef5f9",
    "#edf5f9",
    "#ecf4f9",
    "#ebf4f8",
    "#eaf3f8",
    "#eaf3f8",
    "#e9f2f7",
    "#e8f2f7",
    "#e7f1f7",
    "#e7f0f7",
    "#e6f0f6",
    "#e5eff6",
    "#e4eff6",
    "#e3eef5",
    "#e3eef5",
    "#e2edf5",
    "#e1ecf4",
    "#e0ecf4",
    "#dfebf3",
    "#deeaf3",
    "#ddeaf3",
    "#dce9f2",
    "#dce8f2",
    "#dbe8f2",
    "#dae7f1",
    "#d9e6f1",
    "#d8e6f0",
    "#d7e5f0",
    "#d6e4f0",
    "#d5e4ef",
    "#d4e3ef",
    "#d3e2ee",
    "#d2e1ee",
    "#d1e1ee",
    "#d0e0ed",
    "#cfdfed",
    "#cedeec",
    "#cddeec",
    "#ccddec",
    "#cbdceb",
    "#cadbeb",
    "#c9dbea",
    "#c8daea",
    "#c7d9ea",
    "#c6d8e9",
    "#c5d8e9",
    "#c4d7e8",
    "#c3d6e8",
    "#c2d5e7",
    "#c1d5e7",
    "#c0d4e7",
    "#bfd3e6",
    "#bed2e6",
    "#bdd2e5",
    "#bcd1e5",
    "#bbd0e5",
    "#bacfe4",
    "#b9cfe4",
    "#b8cee3",
    "#b7cde3",
    "#b5cce3",
    "#b4cce2",
    "#b3cbe2",
    "#b2cae1",
    "#b1c9e1",
    "#b0c9e1",
    "#afc8e0",
    "#afc7e0",
    "#aec6df",
    "#adc5df",
    "#acc5de",
    "#abc4de",
    "#aac3de",
    "#a9c2dd",
    "#a8c1dd",
    "#a7c0dc",
    "#a6c0dc",
    "#a5bfdb",
    "#a4bedb",
    "#a3bdda",
    "#a3bcda",
    "#a2bbd9",
    "#a1bad9",
    "#a0b9d8",
    "#9fb8d8",
    "#9fb7d7",
    "#9eb6d7",
    "#9db5d6",
    "#9cb4d6",
    "#9cb3d5",
    "#9bb2d5",
    "#9ab1d4",
    "#9ab0d4",
    "#99afd3",
    "#98aed3",
    "#98add2",
    "#97acd1",
    "#97aad1",
    "#96a9d0",
    "#95a8d0",
    "#95a7cf",
    "#94a6ce",
    "#94a5ce",
    "#93a3cd",
    "#93a2cc",
    "#92a1cc",
    "#92a0cb",
    "#929fcb",
    "#919dca",
    "#919cc9",
    "#909bc9",
    "#909ac8",
    "#9098c7",
    "#8f97c7",
    "#8f96c6",
    "#8f95c6",
    "#8f93c5",
    "#8e92c4",
    "#8e91c4",
    "#8e8fc3",
    "#8e8ec2",
    "#8e8dc2",
    "#8d8cc1",
    "#8d8ac0",
    "#8d89c0",
    "#8d88bf",
    "#8d86be",
    "#8d85be",
    "#8d84bd",
    "#8c82bc",
    "#8c81bc",
    "#8c80bb",
    "#8c7eba",
    "#8c7dba",
    "#8c7cb9",
    "#8c7ab9",
    "#8c79b8",
    "#8c78b7",
    "#8c76b7",
    "#8c75b6",
    "#8c74b5",
    "#8c72b5",
    "#8c71b4",
    "#8c70b3",
    "#8b6eb3",
    "#8b6db2",
    "#8b6cb1",
    "#8b6ab1",
    "#8b69b0",
    "#8b68af",
    "#8b66af",
    "#8b65ae",
    "#8b64ae",
    "#8b62ad",
    "#8b61ac",
    "#8b60ac",
    "#8b5eab",
    "#8a5daa",
    "#8a5caa",
    "#8a5aa9",
    "#8a59a8",
    "#8a58a8",
    "#8a56a7",
    "#8a55a6",
    "#8a54a6",
    "#8a52a5",
    "#8951a4",
    "#894fa3",
    "#894ea3",
    "#894da2",
    "#894ba1",
    "#894aa1",
    "#8949a0",
    "#88479f",
    "#88469e",
    "#88449d",
    "#88439d",
    "#88419c",
    "#88409b",
    "#873f9a",
    "#873d99",
    "#873c98",
    "#873a98",
    "#873997",
    "#863796",
    "#863695",
    "#863494",
    "#863393",
    "#853192",
    "#853091",
    "#852f90",
    "#852d8f",
    "#842c8e",
    "#842a8d",
    "#84298c",
    "#83278b",
    "#83268a",
    "#822589",
    "#822388",
    "#812287",
    "#812186",
    "#801f84",
    "#801e83",
    "#7f1d82",
    "#7e1c81",
    "#7e1a80",
    "#7d197f",
    "#7c187d",
    "#7b177c",
    "#7b167b",
    "#7a1579",
    "#791478",
    "#781377",
    "#771276",
    "#761174",
    "#741073",
    "#730f72",
    "#720f70",
    "#710e6f",
    "#700d6d",
    "#6e0c6c",
    "#6d0c6b",
    "#6c0b69",
    "#6a0a68",
    "#690a66",
    "#680965",
    "#660863",
    "#650862",
    "#630760",
    "#62075f",
    "#60065d",
    "#5f055c",
    "#5d055a",
    "#5c0459",
    "#5a0457",
    "#580356",
    "#570354",
    "#550253",
    "#540251",
    "#520150",
    "#50014e",
    "#4f004d",
    "#4d004b",
  ];

  const translate = `translate(${width/2}, ${height/2})`
  
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateRgbBasis(colors))
    .domain([0, data.length]);


  const arcGenerator = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);


  const pieGenerator = d3
    .pie()
    .padAngle(0)
    .value((d) => d.value);

  const pie : any = pieGenerator(data)
  // let count = 0;
  // Append arcs
  // const path = arc
  //   .append("path")
  //   .attr("d", arcGenerator)
  //   .attr("id", function (d) {
  //     return "arc-" + count++;
  //   })
  //   .style("fill", (_, i) => colorScale(i))
  //   .style("stroke", "#ffffff")
  //   .style("stroke-width", 0)
  //   .each(function (d) {
  //     this._current = d;
  //   });

  // // Append text labels
  // arc
  //   .append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("alignment-baseline", "middle")
  //   .text((d) => d.data.value)
  //   .style("fill", (_, i) => colorScale(transformedData.length - i))
  //   .attr("transform", (d) => {
  //     const [x, y] = arcGenerator.centroid(d);
  //     return `translate(${x}, ${y})`;
  //   });

    return (
      <g transform = {translate}  >
        {data.map((d: any, i:number) => 
        <path 
          key = {d.pieLabelProp}
          data = {pieGenerator(data)}
          id = {"arc-" + i}
          stroke = {"#ffffff"}
          strokeWidth = {0}
          fill = {colorScale(d.length-i)}
        />)}
      </g>
    )

 
}

export default PieChartBody
