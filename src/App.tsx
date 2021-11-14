/* eslint-disable no-unused-vars */
import './App.css';
import ScatterChart from './charts/ScatterPlot/ScatterPlot';
import penguins from './data/penguins.json'


function App() {

  return (
    <div className="App">
            <ScatterChart 
                data={penguins} 
                height="100%" 
                width="100%" 
                xDataProp = 'flipper_length_mm'
                yDataProp = 'body_mass_g'
                xAxis='bottom'
                yAxis='left'
                xGrid = {true}
                yGrid = {true}
                xAxisLabel = 'Flipper, mm'
                yAxisLabel = 'Body Mass, g'
                
            />
     </div>
  );
}

export default App;