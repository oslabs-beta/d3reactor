/* eslint-disable no-unused-vars */
import "./App.css"
import BarChart from "./charts/BarChart/BarChart"
import LineChart from "./charts/LineChart/LineChart"
import AreaChart from "./charts/AreaChart/AreaChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import unemployment from "./data/unemployment.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"

import skinny_fruit from "./data/skinny_fruit.json"

function App() {
  return (
    <div className="App">
      <AreaChart
        data={penguins}
        height="100%"
        width="100%"
        xData={{ key: "body_mass_g", dataType: "number" }}
        yData={{ key: "culmen_length_mm", dataType: "number" }}
        xGrid={true}
        yGrid={true}
        // groupBy='species'
      />

      <AreaChart
        data={skinny_fruit}
        xData={{ key: "date", dataType: "date" }}
        yData={{ key: "value", dataType: "number" }}
        groupBy='fruit'
        xGrid={true}
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Number of fruit" 
      />
      
      <ScatterPlot
        data={penguins}
        xData={{ key: "flipper_length_mm", dataType: "number" }}
        yData={{ key: "body_mass_g", dataType: "number" }}
        groupBy="species"
        xAxis="bottom"
        yAxis="left"
        xGrid={true}
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />

      <BarChart
        data={skinny_fruit}
        xData={{ key: "date", dataType: "date" }}
        yData={{ key: "value", dataType: "number" }}
        groupBy='fruit'
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />

      <LineChart
        data={unemployment}
        xData={{ key: "date", dataType: "date" }}
        yData={{ key: "unemployment", dataType: "number" }}
        groupBy="division"
        xAxis="bottom"
        yAxis="left"
        xGrid={true}
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Unemployment"
      />

      <LineChart
        data={portfolio}
        xData={{ key: "date", dataType: "date" }}
        yData={{ key: "value", dataType: "number" }}
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
