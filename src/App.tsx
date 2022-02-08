import React, {useState, useEffect } from 'react';

import BarChart from './charts/BarChart/BarChart';
import AreaChart from './charts/AreaChart/AreaChart';
import LineChart from './charts/LineChart/LineChart';
import ScatterPlot from './charts/ScatterPlot/ScatterPlot';
import PieChart from './charts/PieChart/PieChart';
import { Container } from './styles/componentStyles';

import portfolio from '../data/portfolio.json';
import penguins from '../data/penguins.json';
import fruit from '../data/fruit.json';
import unemployment from '../data/unemployment.json'
import skinny_fruit from '../data/skinny_fruit.json';


function App() {
  const [pie, setPie] = useState(fruit.sort((a, b) => a.value - b.value).slice(2))
  const [bar, setBar] = useState(skinny_fruit.reverse().slice(2))
  const [area, setArea] = useState(portfolio.slice(30, 60))
  const [line, setLine] = useState(unemployment.slice(0, 60))
  const [scatter, setScatter] = useState(penguins.slice(30, 60))

  useEffect(() => {
    setTimeout(() => {setPie(fruit.sort((a, b) => a.value - b.value))}, 1000);
    setTimeout(() => {setBar(skinny_fruit.reverse())}, 2000);
    setTimeout(() => {setArea(portfolio.slice(0, 60))}, 4000);
    setTimeout(() => {setLine(unemployment)}, 6000);
    setTimeout(() => {setScatter(penguins)}, 8000);
  }, [])
  return (
    <Container className="app">
      <PieChart
        theme="dark"
        data={pie}
        label="label"
        value="value"
        outerRadius={400}
        pieLabel={true}
      />
      <BarChart
        theme="light"
        height="100%"
        width="100%"
        data={bar}
        xKey="date"
        yKey="value"
        groupBy="fruit"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
        tooltipVisible={true}
      />
      <AreaChart
        theme="dark"
        height="100%"
        width="100%"
        data={area}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
      <LineChart
        theme="light"
        height={'100%'}
        width={'100%'}
        data={line}
        xKey="date"
        xDataType="date"
        groupBy='division'
        yKey="unemployment"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'right'}
        legendLabel="Markets"
      />
      <ScatterPlot
        theme="light"
        height="100%"
        width="100%"
        data={scatter}
        groupBy={'species'}
        xKey="flipper_length_mm"
        xDataType="number"
        xGrid={true}
        xAxis="bottom"
        xAxisLabel="Flipper Length"
        yKey="body_mass_g"
        yGrid={true}
        yAxis="right"
        yAxisLabel="Body Mass"
        legend={'right'}

      />
    </Container>
  );
}

export default App;
