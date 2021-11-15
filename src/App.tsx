/* eslint-disable no-unused-vars */
import './App.css';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import AreaChart from './charts/ScatterPlot/ScatterPlot';
import penguins from './data/penguins.json';
import countries from './data/countries.json';
import { transformCountryData } from './utils';  

function App() {

  return (
    <div className="App" style={{backgroundColor: "rgb(64,64,64)"}}>
            <AreaChart 
                data={transformCountryData(countries)} 
                height="100%" 
                width="100%" 
                xDataProp = 'flipper_length_mm'
                yDataProp = 'body_mass_g'
                xAxis='bottom'
                yAxis='left'
                xAxisLabel = 'Time'
                yAxisLabel = 'something or other'
            />
     </div>
  );
}

export default App;