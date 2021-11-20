/* eslint-disable no-unused-vars */
import "./App.css"
import LineChart from "./charts/LineChart/LineChart"
import AreaChartTest from "./charts/AreaChart/AreaChartTest"
import AreaChart from "./charts/AreaChart/AreaChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import aapl from "./data/aapl.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"
import countries from "./data/countries.json"
import fruit from "./data/fruit.json"
import skinny_fruit from "./data/skinny_fruit.json"

function App() {
  return (
    <div className="App">
      <AreaChart
        data={portfolio}
        height="100%"
        width="100%"
        xData={{ key: "date", dataType: "date" }}
        yData={{ key: 'marketvalue', dataType: "number" }}
        xAxis="bottom"
        yAxis="left"
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
    </div>
  )
}

export default App
