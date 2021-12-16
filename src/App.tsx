/* eslint-disable no-unused-vars */
import "./App.css"
import BarChart from "./charts/BarChart/BarChart"
import LineChart from "./charts/LineChart/LineChart"
import AreaChart from "./charts/AreaChart/AreaChart"
import ScatterPlot from "./charts/ScatterPlot/ScatterPlot"
import PieChart from "./charts/PieChart/PieChart"
import unemployment from "./data/unemployment.json"
import penguins from "./data/penguins.json"
import portfolio from "./data/portfolio.json"
import fruit from "./data/fruit.json"
import skinny_fruit from "./data/skinny_fruit.json"

function App() {
  return (
    <div className="App" >
      <div className="PieDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}></div>
        <div style={{width: '50%'}}>
        <PieChart
          data={fruit}
          label= "label"
          value = "value"
        />
        </div>
        <div style={{width: '50%'}}>
        <PieChart
          data={fruit}
          label= "label"
          value = "value"
          innerRadius = "70%"
          outerRadius = "80%"
        />
        </div>
      <div/>

      <div className="AreaDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
        <AreaChart
          data={penguins}
          height="300"
          width="100%"
          xKey={{ key: "body_mass_g", dataType: "number" }}
          yKey={{ key: "culmen_length_mm", dataType: "number" }}
          xGrid={true}
          yGrid={true}
        />
        <AreaChart
          data={skinny_fruit}
          height="300"
          xKey={{ key: "date", dataType: "date" }}
          yKey={{ key: "value", dataType: "number" }}
          groupBy='fruit'
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Number of fruit" 
        />
      </div>

      <div className="ScatterDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
        <ScatterPlot
          height="300"
          data={penguins}
          xKey={{ key: "flipper_length_mm", dataType: "number" }}
          yKey={{ key: "body_mass_g", dataType: "number" }}
          groupBy="species"
          xAxis="bottom"
          yAxis="left"
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
      </div>

      <div className="BarDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
        <BarChart
          height="300"
          data={skinny_fruit}
          xKey={{ key: "date"}}
          yKey={{ key: "value"}}
          groupBy='fruit'
          xAxis="bottom"
          yAxis="left"
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
        <BarChart
          height="300"
          data={skinny_fruit}
          xKey={{ key: "date"}}
          yKey={{ key: "value"}}
          // groupBy='fruit'
          xAxis="bottom"
          yAxis="left"
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
      </div>

      <div className="LineDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center'}}>
        <LineChart
          height="300"
          data={unemployment}
          xKey={{ key: "date", dataType: "date" }}
          yKey={{ key: "unemployment", dataType: "number" }}
          groupBy="division"
          xAxis="bottom"
          yAxis="left"
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Unemployment"
        />
        <LineChart
          height="300"
          data={portfolio}
          xKey={{ key: "date", dataType: "date" }}
          yKey={{ key: "value", dataType: "number" }}
          xAxis="bottom"
          yAxis="left"
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
      </div>

    
    </div>
  )
}

export default App
