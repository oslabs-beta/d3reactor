/* eslint-disable no-unused-vars */
import "./App.css"
import LineChart from "./charts/LineChart/LineChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"

function App() {
  return (
    <div className="App">
      <LineChart
        // data={penguins}
        data={portfolio}
        height="100%"
        width="100%"
        // xDataProp={{ key: "body_mass_g", dataType: "number" }}
        xDataProp={{ key: "date", dataType: "date" }}
        // yDataProp={{ key: "flipper_length_mm", dataType: "number" }}
        yDataProp={{ key: "value", dataType: "number" }}
        xAxis="bottom"
        yAxis="left"
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
      <ScatterPlot
        data={portfolio}
        // data={penguins}
        height="100%"
        width="100%"
        xDataProp={{ key: "date", dataType: "date" }}
        // xDataProp={{ key: "flipper_length_mm", dataType: "number" }}
        yDataProp={{ key: "value", dataType: "number" }}
        // yDataProp={{ key: "body_mass_g", dataType: "number" }}
        xAxis="bottom"
        yAxis="left"
        xGrid={true}
        yGrid={true}
        xAxisLabel="Flipper, mm"
        yAxisLabel="Body Mass, g"
      />
    </div>
  )
}

export default App
