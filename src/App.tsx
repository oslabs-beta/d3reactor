import React from 'react';
import './App.css';
import BarChart from './charts/BarChart/BarChart';
import AreaChart from './charts/AreaChart/AreaChart';
import LineChart from './charts/LineChart/LineChart';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import PieChart from './charts/PieChart/PieChart';

import unemployment from './data/unemployment.json';
import portfolio from './data/portfolio.json';
import penguins from './data/penguins.json';
import fruit from './data/fruit.json';

function App() {
  return (
    <div className="app">
      {/* <PieChart
        data={fruit}
        label="label"
        value="value"
        outerRadius={240}
        colorScheme="schemePurples"
      />
      <BarChart
        height="100%"
        width="100%"
        data={portfolio.slice(30, 38)}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        colorScheme="schemeBlues"
      />
      <AreaChart
        height="100%"
        width="100%"
        data={portfolio.slice(30, 60)}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      /> */}
      <LineChart
        height="100%"
        width="100%"
        data={portfolio}
        xKey="date"
        xDataType="date"
        yKey="value"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
      {/* <ScatterPlot
        height="100%"
        width="100%"
        data={penguins}
        xKey="flipper_length_mm"
        xDataType="number"
        xGrid={true}
        xAxis="bottom"
        xAxisLabel="Flipper Length"
        yKey="body_mass_g"
        yGrid={true}
        yAxis="right"
        yAxisLabel="Body Mass"
      /> */}
    </div>
  );
}

export default App;
