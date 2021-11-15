/* eslint-disable no-unused-vars */
import "./App.css"
import LineChart from "./charts/LineChart/LineChart"
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
    </div>
  )
}

export default App
