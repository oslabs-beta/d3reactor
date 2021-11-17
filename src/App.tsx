/* eslint-disable no-unused-vars */
import "./App.css"
import BarChart from "./charts/BarChart/BarChart"
import LineChart from "./charts/LineChart/LineChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import sales from "./data/sales.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"

function App() {
  return (
    <div className="App">
      <BarChart
        data={sales}
        height="100%"
        width="100%"
        xDataProp={{ key: "year", dataType: "number" }}
        yDataProp={{ key: "sales", dataType: "number" }}
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
    </div>
  )
}

export default App
