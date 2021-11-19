/* eslint-disable no-unused-vars */
import "./App.css"
import BarChart from "./charts/BarChart/BarChart"
import LineChart from "./charts/LineChart/LineChart"
import AreaChartTest from "./charts/AreaChart/AreaChartTest"
import AreaChart from "./charts/AreaChart/AreaChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import aapl from "./data/aapl.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"
import countries from "./data/countries.json"
import fruit from "./data/fruit.json"
import { transformCountryData, findKeys } from "./utils"

function App() {
  return (
    <div className="App">
      <LineChart
        data={aapl}
        height="100%"
        width="100%"
        xDataProp={{ key: "date", dataType: "date" }}
        yDataProp={{ keys: ["close"], dataType: "number" }}
        xAxis="bottom"
        yAxis="left"
        xGrid={true}
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
    </div>
  )
}

export default App
