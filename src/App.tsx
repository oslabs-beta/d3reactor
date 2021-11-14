/* eslint-disable no-unused-vars */
import './App.css';
import LineChart from './charts/LineChart/LineChart';
import penguins from './data/penguins.json'
import portfolio from './data/portfolio.json'


function App() {
  console.log(portfolio)
  return (
    <div className="App">
            <LineChart
                // data={penguins}
                data={portfolio}
                height="100%"
                width="100%" 
                // xDataProp ={{key: 'body_mass_g', type: 'number'}}
                xDataProp ={{key: 'date', type: 'date'}}
                // yDataProp ={{key: 'flipper_length_mm', type: 'number'}}
                yDataProp ={{key: 'value', type: 'number'}}
                xAxis='bottom'
                yAxis='left'
                xAxisLabel = 'Date'
                yAxisLabel = 'Value'
            />
     </div>
  );
}

export default App;