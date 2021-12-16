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
    <div className="App" style={{backgroundColor: "rgb(64,64,64)"}}>
      <div className="PieDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: "rgb(64,64,64)"}}></div>
        <div style={{width: '50%'}}>
        <PieChart
          data={fruit}
          label= "label"
          value = "value"
        />
        </div>
        <div style={{width: '50%', backgroundColor: "rgb(64,64,64)"}}>
        <PieChart
          data={fruit}
          label= "label"
          value = "value"
          innerRadius = "70%"
          outerRadius = "80%"
        />
        </div>
      <div/>

      <div className="AreaDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: "rgb(64,64,64)"}}>
        <AreaChart
          data={penguins}
          height="300"
          width="100%"
          xKey="body_mass_g"
          xDataType="number"
          yKey="culmen_length_mm"
          xGrid={true}
          yGrid={true}
        />
        <AreaChart
          data={skinny_fruit}
          height="300"
          xKey="date"
          xDataType="date"
          yKey="value"
          groupBy='fruit'
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Number of fruit" 
        />
      </div>

      <div className="ScatterDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: "rgb(64,64,64)"}}>
        <ScatterPlot
          height="300"
          data={penguins}
          xKey="flipper_length_mm"
          xDataType="number"
          yKey="body_mass_g"
          groupBy="species"
          xAxis="bottom"
          yAxis="left"
          xGrid={true}
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
      </div>

      <div className="BarDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: "rgb(64,64,64)"}}>
        <BarChart
          height="300"
          data={skinny_fruit}
          xKey="date"
          yKey="value"
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
          xKey="date"
          yKey="value"
          // groupBy='fruit'
          xAxis="bottom"
          yAxis="left"
          yGrid={true}
          xAxisLabel="Date"
          yAxisLabel="Value"
        />
      </div>

      <div className="LineDemo" style={{display: 'inline-flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: "rgb(64,64,64)"}}>
        <LineChart
          height="300"
          data={unemployment}
          xKey="date"
          xDataType="date"
          yKey="unemployment"
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
          xKey="date"
          xDataType="date"
          yKey="value"
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
