/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './App.css';
import ScatterChart from './charts/ScatterPlot/ScatterPlot';
import penguins from './data/penguins.json'


function App() {

  const [dat, setDat] = useState(penguins)
  const [upd, setUpd] = useState(false)
  
  useEffect(() => {
    if(upd) return;
    setUpd(true)
    
    
    setTimeout(() =>{setDat(
     penguins.slice(0, 10)
    );
    },5000)
  },[upd])

  return (
    <div className="App">
            <ScatterChart 
                data={dat} 
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