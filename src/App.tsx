import React from 'react';
import './App.css';
import BarChart from './charts/BarChart/BarChart';
import portfolio from './data/portfolio.json';

function App() {
  return (
    <div className="app">
      <BarChart
        height="100%"
        width="100%"
        data={portfolio.slice(5, 10)}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
    </div>
  );
}

export default App;
