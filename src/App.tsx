import React from 'react';
import './App.css';
import Test from './components/Test';

import BarChart from './charts/BarChart/BarChart';
import LineChart from './charts/LineChart/LineChart';
import AreaChart from './charts/AreaChart/AreaChart';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import PieChart from './charts/PieChart/PieChart';

import unemployment from './data/unemployment.json';
import penguins from './data/penguins.json';
import portfolio from './data/portfolio.json';
import fruit from './data/fruit.json';
import skinny_fruit from './data/skinny_fruit.json';
import sales from './data/sales.json';

function App() {
  return (
    <div className="app">
      {/* <PieChart
        data={fruit}
        label="label"
        value="value"
        legend="top-right"
        outerRadius={240}
        legendLabel="l"
        pieLabel={true}
      />
      <AreaChart
        data={skinny_fruit}
        xKey="date"
        yKey="value"
        groupBy='fruit'
        xAxis='bottom'
        xAxisLabel='OOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPS!'
        width={'80%'}
        height={'80%'}
        legend='bottom'
      />
      <AreaChart
        data={portfolio}
        xKey="date"
        yKey="value"
        xAxis='bottom'
      />
      <BarChart
        data={skinny_fruit}
        xKey="date"
        yKey="value"
        groupBy='fruit'
        xAxis='bottom'
        // xAxisLabel='OOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPSOOPS!'
        width={'80%'}
        height={'80%'}
        legend='bottom'
      /> */}
      <BarChart
        data={portfolio}
        xKey="date"
        yKey="value"
      />
      {/* <ScatterPlot
        data={skinny_fruit}
        xKey="date"
        yKey="value"
        groupBy='fruit'
      />
      <ScatterPlot
        data={portfolio}
        xKey="date"
        yKey="value"
      />
      <LineChart
        data={skinny_fruit}
        xKey="date"
        yKey="value"
        groupBy='fruit'
      />
      <LineChart
        data={portfolio}
        xKey="date"
        yKey="value"
        xGrid={true}
        yGrid={true}
        xAxis="bottom"
        yAxis="right"
      /> */}
      
      {/* <Test /> */}
    </div>
  );
}

export default App;
