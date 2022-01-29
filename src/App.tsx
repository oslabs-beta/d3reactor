import React from 'react';
import BarChart from './charts/BarChart/BarChart';
import AreaChart from './charts/AreaChart/AreaChart';
import LineChart from './charts/LineChart/LineChart';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import PieChart from './charts/PieChart/PieChart';
import GlobalStyle from './styles/globals';
import { Container } from './styles/componentStyles';

import skinny_fruit from '../data/skinny_fruit.json';

//data taken from https://data.world/2918diy/coffee-chain
import coffee_shop from '../data/coffee_shop.json';

//data taken from https://fred.stlouisfed.org/
import ny_unemployment from '../data/ny_unemployment.json';

//data taken from https://ourworldindata.org/grapher/life-expectancy-vs-gdp-per-capita
import life_expectancy from '../data/life_expectancy.json';

//data taken from https://www.ers.usda.gov/data-products/international-macroeconomic-data-set/
import historical_gdp from '../data/historical_gdp.json';

function App() {
  return (
    <Container className="app">
      <GlobalStyle />
      <PieChart
        data={coffee_shop}
        label="product"
        value="sales"
        outerRadius={300}
        innerRadius={200}
        pieLabel={false}
        legend="right"
        legendLabel="Annual Sales 2021"
      />
      <ScatterPlot
        height="100%"
        width="100%"
        data={life_expectancy}
        xKey="GDP per capita"
        xDataType="number"
        xGrid={true}
        xAxis="bottom"
        xAxisLabel="GDP per capita"
        yKey="Life expectancy"
        yGrid={true}
        yAxis="right"
        yAxisLabel="Life Expectancy"
      />
      <LineChart
        height={'100%'}
        width={'100%'}
        data={ny_unemployment}
        groupBy="county"
        xKey="date"
        xDataType="date"
        yKey="unemployment rate"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Unemployment Rate"
        legend={'right'}
        legendLabel="Counties"
      />
      <BarChart
        height="100%"
        width="100%"
        data={historical_gdp}
        xKey="year"
        yKey="GDP"
        groupBy="group"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
      />
      <AreaChart
        height="100%"
        width="100%"
        data={skinny_fruit}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        groupBy="fruit"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend="bottom"
        legendLabel="Fruits"
      />
    </Container>
  );
}

export default App;
