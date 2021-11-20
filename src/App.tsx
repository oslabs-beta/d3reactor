/* eslint-disable no-unused-vars */
import "./App.css"
import BarChart from "./charts/BarChart/BarChart"
import LineChart from "./charts/LineChart/LineChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import PieChart from "./charts/PieChart/PieChart"
import sales from "./data/sales.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"
import fruit from "./data/fruit.json"

function App() {
  return (
    <div className="App">
      <PieChart
        data={fruit}
        outerRadius = {200}
        innerRadius = {0}
      />
    </div>
  )
}

export default App
