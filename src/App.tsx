/* eslint-disable no-unused-vars */
import './App.css';
import LineChart from './charts/LineChart/LineChart';
import portfolio from './data/portfolio.json'


function App() {
  console.log(portfolio)
  return (
    <div className="App">
            <LineChart
                data={portfolio}
                height="100%" 
                width="100%" 
                xDataProp = 'date'
                yDataProp = 'value'
                xAxis='bottom'
                yAxis='left'
                xAxisLabel = 'Date'
                yAxisLabel = 'Value'
            />
     </div>
  );
}

export default App;