import React from 'react';
import BarChart from './charts/BarChart/BarChart';
import AreaChart from './charts/AreaChart/AreaChart';
import LineChart from './charts/LineChart/LineChart';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import PieChart from './charts/PieChart/PieChart';

import portfolio from '../data/portfolio.json';
import penguins from '../data/penguins.json';
import fruit from '../data/fruit.json';
import skinny_fruit from '../data/skinny_fruit.json';

import GlobalStyle from './styles/globals';
import { Container } from './styles/componentStyles';

function App() {
  return (
    <Container className="app">
      <GlobalStyle />
      <AreaChart
        height="100%"
        width="100%"
        data={skinny_fruit}
        groupBy="fruit"
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
      />
      <AreaChart
        height="100%"
        width="100%"
        data={skinny_fruit}
        groupBy="fruit"
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
      />
      <BarChart
        height="100%"
        width="100%"
        data={skinny_fruit}
        groupBy="fruit"
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
      />
    </Container>
  );
}

export default App;
